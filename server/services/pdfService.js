const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const generateTheftReportPDF = async (sheep, owner) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const chunks = [];

            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            // Header with red alert
            doc.rect(0, 0, doc.page.width, 80).fill('#dc2626');
            doc.fillColor('#ffffff')
                .fontSize(28)
                .font('Helvetica-Bold')
                .text('🚨 LIVESTOCK THEFT REPORT', 50, 25, { align: 'center' });

            doc.fillColor('#000000').moveDown(2);

            // Report metadata
            doc.fontSize(10)
                .font('Helvetica')
                .text(`Report Generated: ${new Date().toLocaleString()}`, 50, 100)
                .text(`Report ID: FIR-${sheep._id.toString().toUpperCase().slice(-8)}`, 50, 115);

            doc.moveDown(2);

            // Animal Details Section
            doc.fontSize(16)
                .font('Helvetica-Bold')
                .fillColor('#1e293b')
                .text('ANIMAL IDENTIFICATION', 50, 150);

            doc.rect(50, 170, doc.page.width - 100, 1).fill('#e2e8f0');

            const detailsY = 190;
            doc.fontSize(11).font('Helvetica');

            const details = [
                ['Permanent Tag ID:', sheep.tagId],
                ['Animal Name:', sheep.name || 'Unnamed'],
                ['Breed:', sheep.breed || 'Not specified'],
                ['Age:', sheep.age ? `${sheep.age} years` : 'Not specified'],
                ['Identifying Marks:', sheep.identifyingMarks || 'None recorded'],
                ['Registration Date:', new Date(sheep.createdAt).toLocaleDateString()]
            ];

            let yPos = detailsY;
            details.forEach(([label, value]) => {
                doc.font('Helvetica-Bold').text(label, 50, yPos, { width: 150, continued: true });
                doc.font('Helvetica').text(value, { width: 350 });
                yPos += 25;
            });

            // Theft Details Section
            doc.moveDown(2);
            doc.fontSize(16)
                .font('Helvetica-Bold')
                .fillColor('#dc2626')
                .text('THEFT INCIDENT DETAILS', 50, yPos + 20);

            doc.rect(50, yPos + 40, doc.page.width - 100, 1).fill('#e2e8f0');

            yPos += 60;
            const theftDetails = [
                ['Reported Date & Time:', new Date(sheep.theftReportedAt).toLocaleString()],
                ['Incident Details:', sheep.theftDetails || 'No additional details provided'],
                ['Last Known Location:', sheep.lastSeenLocation || 'Not recorded']
            ];

            doc.fillColor('#000000');
            theftDetails.forEach(([label, value]) => {
                doc.font('Helvetica-Bold').fontSize(11).text(label, 50, yPos);
                yPos += 20;
                doc.font('Helvetica').fontSize(10).text(value, 50, yPos, { width: 500 });
                yPos += 35;
            });

            // Owner Details Section
            doc.fontSize(16)
                .font('Helvetica-Bold')
                .fillColor('#1e293b')
                .text('REGISTERED OWNER DETAILS', 50, yPos + 20);

            doc.rect(50, yPos + 40, doc.page.width - 100, 1).fill('#e2e8f0');

            yPos += 60;
            const ownerDetails = [
                ['Full Name:', owner.fullName],
                ['Contact Phone:', owner.phone],
                ['Aadhaar ID:', owner.aadhaar],
                ['Email:', owner.email || 'Not provided']
            ];

            doc.fillColor('#000000');
            ownerDetails.forEach(([label, value]) => {
                doc.font('Helvetica-Bold').fontSize(11).text(label, 50, yPos, { width: 150, continued: true });
                doc.font('Helvetica').text(value, { width: 350 });
                yPos += 25;
            });

            // QR Code for verification
            const qrY = yPos + 40;
            const verificationUrl = `${process.env.APP_URL || 'http://localhost:5176'}/verify/${sheep.tagId}`;
            const qrDataUrl = await QRCode.toDataURL(verificationUrl, { width: 150 });

            doc.fontSize(14)
                .font('Helvetica-Bold')
                .text('DIGITAL VERIFICATION', 50, qrY);

            doc.image(qrDataUrl, 50, qrY + 25, { width: 120 });
            doc.fontSize(9)
                .font('Helvetica')
                .text('Scan to verify theft status', 50, qrY + 155, { width: 120, align: 'center' });

            // Legal Notice
            doc.fontSize(10)
                .font('Helvetica-Bold')
                .fillColor('#dc2626')
                .text('LEGAL NOTICE', 200, qrY + 25);

            doc.fontSize(9)
                .font('Helvetica')
                .fillColor('#000000')
                .text(
                    'This animal has been reported as STOLEN in the Regional Livestock Archive. ' +
                    'Any transaction involving this animal is ILLEGAL and subject to prosecution. ' +
                    'If you have information about this animal, please contact the owner or local authorities immediately.',
                    200, qrY + 45,
                    { width: 300, align: 'justify' }
                );

            // Footer
            const footerY = doc.page.height - 80;
            doc.rect(0, footerY, doc.page.width, 1).fill('#e2e8f0');
            doc.fontSize(8)
                .fillColor('#64748b')
                .text('LivestockSafe Digital Identity System | Regional Livestock Archive', 50, footerY + 15, { align: 'center' });
            doc.text('This is an official theft report generated from verified blockchain records.', 50, footerY + 30, { align: 'center' });
            doc.text(`Document Hash: ${sheep._id.toString().toUpperCase()}`, 50, footerY + 45, { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateTheftReportPDF };
