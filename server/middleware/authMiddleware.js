const admin = require('firebase-admin');
const db = require('../config/firebase');

const verifyAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        const adminDoc = await db.collection('admins').doc(decoded.uid).get();

        if (!adminDoc.exists) {
            return res.status(403).json({ message: 'Not an admin' });
        }

        req.admin = { uid: decoded.uid, ...adminDoc.data() };
        console.log('Admin loaded:', req.admin);
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { verifyAdmin };


