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
        const docRef = await db.collection('games').add(req.body);
        return res.status(201).json({ id: docRef.id, ...req.body });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating game' });
    }
};

const updateGame = async (req, res) => {
    try {
        const doc = await db.collection('games').doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Game not found' });
        }
        await db.collection('games').doc(req.params.id).update(req.body);
        return res.json({ id: req.params.id, ...req.body });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating game' });
    }
};

module.exports = { getGameById, createGame, updateGame };

