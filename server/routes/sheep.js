const express = require('express');
const router = express.Router();
const Sheep = require('../models/Sheep');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Get all sheep for owner
router.get('/', auth, async (req, res) => {
    try {
        const sheep = await Sheep.find({ owner: req.userId }).sort({ createdAt: -1 });
        res.json(sheep);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get single sheep
router.get('/:id', auth, async (req, res) => {
    try {
        const sheep = await Sheep.findById(req.params.id);
        if (!sheep) return res.status(404).json({ message: 'Sheep not found' });
        if (sheep.owner.toString() !== req.userId) return res.status(401).json({ message: 'Not authorized' });
        res.json(sheep);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Register new sheep
router.post('/', auth, async (req, res) => {
    try {
        const { name, tagId, identifyingMarks, age, breed } = req.body;

        const newSheep = new Sheep({
            owner: req.userId,
            name,
            tagId: tagId.trim(),
            identifyingMarks,
            age,
            breed,
            status: 'active'
        });

        const sheep = await newSheep.save();
        res.json(sheep);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update sheep status (e.g., mark as stolen)
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status, theftDetails, location } = req.body;
        let sheep = await Sheep.findById(req.params.id).populate('owner');

        if (!sheep) return res.status(404).json({ message: 'Sheep not found' });
        if (sheep.owner._id.toString() !== req.userId) return res.status(401).json({ message: 'Not authorized' });

        sheep.status = status;
        if (status === 'stolen') {
            sheep.theftReportedAt = new Date();
            sheep.theftDetails = theftDetails;

            // Capture geolocation if provided
            if (location && location.latitude && location.longitude) {
                sheep.theftLocation = {
                    type: 'Point',
                    coordinates: [parseFloat(location.longitude), parseFloat(location.latitude)]
                };
                sheep.lastSeenLocation = location.address || `${location.latitude}, ${location.longitude}`;
            } else {
                // Don't set theftLocation if no coordinates - avoid GeoJSON error
                sheep.lastSeenLocation = 'Location not captured';
            }

            // Send email notification
            const { sendTheftAlert } = require('../services/emailService');
            if (sheep.owner.email) {
                sendTheftAlert(sheep.owner.email, sheep).catch(err =>
                    console.error('Email notification failed:', err.message)
                );
            }

            // Send push notification
            const { sendPushNotification } = require('../services/pushService');
            if (sheep.owner.fcmToken) {
                sendPushNotification(sheep.owner.fcmToken, sheep).catch(err =>
                    console.error('Push notification failed:', err.message)
                );
            }

            // Send SMS notification
            const { sendTheftAlertSMS } = require('../services/smsService');
            if (sheep.owner.phone) {
                sendTheftAlertSMS(sheep.owner.phone, sheep).catch(err =>
                    console.error('SMS notification failed:', err.message)
                );
            }

            console.log(`🚨 THEFT ALERT: ${sheep.tagId} reported stolen by ${sheep.owner.fullName}`);
        }

        await sheep.save();
        res.json(sheep);
    } catch (err) {
        console.error('Status update error:', err);
        res.status(500).send('Server error');
    }
});

// Public verification endpoint (for QR scan)
router.get('/verify/:tagId', async (req, res) => {
    try {
        const { tagId } = req.params;
        console.log('Verifying Tag ID:', tagId);

        // Escape characters for regex and matching
        const escaped = tagId.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const sheep = await Sheep.findOne({
            tagId: { $regex: new RegExp(`^${escaped}$`, 'i') }
        }).populate('owner', 'fullName phone');

        if (!sheep) {
            console.log('Verification failed: Tag not found -', tagId);
            return res.status(404).json({ message: 'Sheep ID not found in system' });
        }

        res.json(sheep);
    } catch (err) {
        console.error('Verification error:', err);
        res.status(500).send('Server error');
    }
});

// Public stolen list endpoint
router.get('/public/stolen', async (req, res) => {
    try {
        const stolenSheep = await Sheep.find({ status: 'stolen' })
            .populate('owner', 'fullName phone')
            .sort({ theftReportedAt: -1 })
            .limit(100);

        res.json(stolenSheep);
    } catch (err) {
        console.error('Stolen list error:', err);
        res.status(500).send('Server error');
    }
});

// Generate theft report PDF
router.get('/:id/theft-report', auth, async (req, res) => {
    try {
        const sheep = await Sheep.findById(req.params.id).populate('owner');

        if (!sheep) return res.status(404).json({ message: 'Sheep not found' });
        if (sheep.owner._id.toString() !== req.userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        if (sheep.status !== 'stolen') {
            return res.status(400).json({ message: 'Animal not reported as stolen' });
        }

        const { generateTheftReportPDF } = require('../services/pdfService');
        const pdfBuffer = await generateTheftReportPDF(sheep, sheep.owner);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=FIR-${sheep.tagId}-${Date.now()}.pdf`);
        res.send(pdfBuffer);
    } catch (err) {
        console.error('PDF generation error:', err);
        res.status(500).json({ message: 'Failed to generate report' });
    }
});

module.exports = router;
