var path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

var admin = require("firebase-admin");

var serviceAccount = require(path.resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;