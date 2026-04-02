const db = require('../config/firebase');

const getGameById = async (req, res) => {
    try {
        const doc = await db.collection('games').doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Game not found' });
        }
        return res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching game' });
    }
};

const createGame = async (req, res) => {
    try {
        const gameData = { ...req.body, matchFinished: false };
        const docRef = await db.collection('games').add(gameData);
        return res.status(201).json({ id: docRef.id, ...gameData });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating game' });
    }
};

/**
 * Checks if all players have a non-null score for every hole.
 */
const isMatchFinished = (players) => {
    if (!players || players.length === 0) return false;
    return players.every(player =>
        player.scores && player.scores.length > 0 && player.scores.every(s => s !== null)
    );
};

/**
 * Recalculates average par per hole for a course based on all finished games,
 * then updates the course document with calculatedHolePars and calculatedTotalPar.
 * Only runs if the course uses parMode "calculated".
 */
const recalculateCoursePar = async (courseId) => {
    // Check if the course uses calculated par mode
    const courseDoc = await db.collection('courses').doc(courseId).get();
    if (!courseDoc.exists) return;

    const courseData = courseDoc.data();
    if (courseData.parMode !== 'calculated') return;

    const snapshot = await db.collection('games')
        .where('courseId', '==', courseId)
        .where('matchFinished', '==', true)
        .get();

    if (snapshot.empty) return;

    // Collect all scores per hole across all players in all finished games
    const holeScoreSums = {};
    const holeScoreCounts = {};

    snapshot.docs.forEach(doc => {
        const game = doc.data();
        game.players.forEach(player => {
            player.scores.forEach((score, holeIndex) => {
                if (score !== null) {
                    holeScoreSums[holeIndex] = (holeScoreSums[holeIndex] || 0) + score;
                    holeScoreCounts[holeIndex] = (holeScoreCounts[holeIndex] || 0) + 1;
                }
            });
        });
    });

    // Calculate average per hole, rounded to nearest integer
    const holeIndices = Object.keys(holeScoreSums).map(Number).sort((a, b) => a - b);
    const calculatedHolePars = holeIndices.map(i =>
        Math.round(holeScoreSums[i] / holeScoreCounts[i])
    );
    const calculatedTotalPar = calculatedHolePars.reduce((sum, p) => sum + p, 0);

    await db.collection('courses').doc(courseId).update({
        calculatedHolePars,
        calculatedTotalPar,
    });

    console.log(`Recalculated par for course ${courseId}: [${calculatedHolePars.join(', ')}] = ${calculatedTotalPar}`);
};

const updateGame = async (req, res) => {
    try {
        const gameId = req.params.id;
        const doc = await db.collection('games').doc(gameId).get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Game not found' });
        }

        const existingGame = doc.data();
        const gameData = { ...req.body };

        // Auto-detect matchFinished
        const wasFinished = existingGame.matchFinished === true;
        const nowFinished = isMatchFinished(gameData.players);
        gameData.matchFinished = nowFinished;

        await db.collection('games').doc(gameId).update(gameData);

        // If the match just became finished, recalculate course par
        if (nowFinished && !wasFinished) {
            try {
                await recalculateCoursePar(gameData.courseId || existingGame.courseId);
            } catch (err) {
                console.error('Error recalculating course par:', err);
                // Don't fail the game update because of this
            }
        }

        return res.json({ id: gameId, ...gameData });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating game' });
    }
};

module.exports = { getGameById, createGame, updateGame };
