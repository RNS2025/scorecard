const db = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');

const publishScores = async (req, res) => {
    try {
        const entries = req.body;

        if (!Array.isArray(entries) || entries.length === 0) {
            return res.status(400).json({ message: 'Request body must be a non-empty array of entries' });
        }

        const batch = db.batch();
        const results = [];

        for (const entry of entries) {
            const docRef = db.collection('leaderboard').doc();
            batch.set(docRef, {
                ...entry,
                createdAt: FieldValue.serverTimestamp(),
            });
            results.push({ id: docRef.id, ...entry });
        }

        await batch.commit();
        return res.status(201).json(results);
    } catch (error) {
        console.error('Error publishing scores:', error);
        return res.status(500).json({ message: 'Error publishing scores' });
    }
};

const getLeaderboard = async (req, res) => {
    try {
        const { courseId, period } = req.query;

        let query = db.collection('leaderboard').orderBy('totalDiff', 'asc');

        if (courseId) {
            query = db.collection('leaderboard')
                .where('courseId', '==', courseId)
                .orderBy('totalDiff', 'asc');
        }

        if (period && period !== 'all') {
            const now = new Date();
            let startDate;

            if (period === 'week') {
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            } else if (period === 'month') {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            }

            if (startDate) {
                query = query.where('createdAt', '>=', startDate);
            }
        }

        const snapshot = await query.get();
        const leaderboard = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? null,
        }));

        return res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return res.status(500).json({ message: 'Error fetching leaderboard' });
    }
};

module.exports = { publishScores, getLeaderboard };

