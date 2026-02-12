// Firebase Admin SDK (optional - only needed for production push notifications)
let admin = null;
try {
    admin = require('firebase-admin');
} catch (e) {
    // Firebase not installed - will use mock mode
}

// Initialize Firebase Admin (you'll need to add your service account key)
// For demo purposes, we'll use a mock implementation
let firebaseInitialized = false;

const initializeFirebase = () => {
    if (firebaseInitialized) return;

    if (!admin) {
        console.log('📱 Push notifications: MOCK mode (Firebase not installed)');
        firebaseInitialized = true;
        return;
    }

    try {
        // In production, use: admin.initializeApp({
        //   credential: admin.credential.cert(require('./firebase-service-account.json'))
        // });
        console.log('Firebase Admin initialized (mock mode for demo)');
        firebaseInitialized = true;
    } catch (error) {
        console.error('Firebase initialization error:', error.message);
    }
};

const sendPushNotification = async (fcmToken, sheepData) => {
    if (!fcmToken) {
        console.log('No FCM token available for push notification');
        return;
    }

    // Mock implementation for demo
    console.log('\n📱 PUSH NOTIFICATION (MOCK MODE):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log({
        to: fcmToken,
        notification: {
            title: '🚨 THEFT ALERT',
            body: `${sheepData.name || sheepData.tagId} has been reported stolen`,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            tag: `theft-${sheepData._id}`,
            requireInteraction: true
        },
        data: {
            sheepId: sheepData._id.toString(),
            tagId: sheepData.tagId,
            type: 'theft_alert',
            url: `/sheep/${sheepData._id}`
        }
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // In production with real Firebase:
    /*
    if (!admin) return;
    
    try {
        const message = {
            notification: {
                title: '🚨 THEFT ALERT',
                body: `${sheepData.name || sheepData.tagId} has been reported stolen`
            },
            data: {
                sheepId: sheepData._id.toString(),
                tagId: sheepData.tagId,
                type: 'theft_alert'
            },
            token: fcmToken
        };

        const response = await admin.messaging().send(message);
        console.log('Push notification sent:', response);
    } catch (error) {
        console.error('Push notification error:', error.message);
    }
    */
};

// Initialize on module load
initializeFirebase();

module.exports = { initializeFirebase, sendPushNotification };
