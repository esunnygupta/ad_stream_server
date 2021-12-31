const admin = require('firebase-admin');
const service = require('./services.json');

// Initialize Firebase Admin SDK
const firebase = admin.initializeApp({
    credential: admin.credential.cert(service),
});

module.exports = {
    firebase
};