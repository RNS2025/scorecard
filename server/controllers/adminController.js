const db = require('../config/firebase');

const getProfile = async (req, res) => {
    try {
        const { courseId } = req.admin;
        const courseDoc = await db.collection('courses').doc(courseId).get();
        const courseName = courseDoc.exists ? courseDoc.data().name : 'Ukendt bane';

        return res.json({ ...req.admin, courseName });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ message: 'Error fetching profile' });
    }
};

const getAdminLeaderboard = async (req, res) => {
    try {
        const { courseId } = req.admin;

        const snapshot = await db.collection('leaderboard')
            .where('courseId', '==', courseId)
            .get();

        const entries = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? null,
        }));

        entries.sort((a, b) => a.totalDiff - b.totalDiff);

        return res.json(entries);
    } catch (error) {
        console.error('Error fetching admin leaderboard:', error);
        return res.status(500).json({ message: 'Error fetching leaderboard' });
    }
};

const getMarketingEmails = async (req, res) => {
    try {
        const { courseId } = req.admin;

        const snapshot = await db.collection('leaderboard')
            .where('courseId', '==', courseId)
            .where('marketingConsent', '==', true)
            .get();

        // Deduplicate by email
        const emailMap = new Map();
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            if (!emailMap.has(data.email)) {
                emailMap.set(data.email, {
                    email: data.email,
                    playerName: data.playerName,
                    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
                });
            }
        });

        const emails = Array.from(emailMap.values());
        return res.json(emails);
    } catch (error) {
        console.error('Error fetching marketing emails:', error);
        return res.status(500).json({ message: 'Error fetching marketing emails' });
    }
};

const getAdminStats = async (req, res) => {
    try {
        const { courseId } = req.admin;

        const snapshot = await db.collection('leaderboard')
            .where('courseId', '==', courseId)
            .get();

        const entries = snapshot.docs.map(doc => doc.data());

        const totalRounds = entries.length;
        const uniquePlayers = new Set(entries.map(e => e.email)).size;
        const avgScore = totalRounds > 0
            ? Math.round(entries.reduce((sum, e) => sum + e.totalShots, 0) / totalRounds)
            : 0;
        const bestScore = totalRounds > 0
            ? Math.min(...entries.map(e => e.totalDiff))
            : null;

        // This week
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const thisWeek = entries.filter(e => {
            const date = e.createdAt?.toDate?.();
            return date && date >= oneWeekAgo;
        });

        // This month
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const thisMonth = entries.filter(e => {
            const date = e.createdAt?.toDate?.();
            return date && date >= monthStart;
        });

        const marketingCount = entries.filter(e => e.marketingConsent).length;
        const uniqueMarketingEmails = new Set(
            entries.filter(e => e.marketingConsent).map(e => e.email)
        ).size;

        return res.json({
            totalRounds,
            uniquePlayers,
            avgScore,
            bestScore,
            roundsThisWeek: thisWeek.length,
            roundsThisMonth: thisMonth.length,
            marketingConsents: marketingCount,
            uniqueMarketingEmails,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return res.status(500).json({ message: 'Error fetching stats' });
    }
};

module.exports = { getProfile, getAdminLeaderboard, getMarketingEmails, getAdminStats };


