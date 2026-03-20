const db = require('../config/firebase');

const getCourses = async (req, res) => {
    try {
        const snapshot = await db.collection('courses').get();
        const courses = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return res.json(courses);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching courses' });
    }
};

const getCourseById = async (req, res) => {
    try {
        const doc = await db.collection('courses').doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Course not found' });
        }
        return res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching course' });
    }
};

const createCourse = async (req, res) => {
    try {
        const docRef = await db.collection('courses').add(req.body);
        return res.status(201).json({ id: docRef.id, ...req.body });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating course' });
    }
};

const addHoles = async (req, res) => {
    try {
        const doc = await db.collection('courses').doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const holes = req.body.holes;
        if (!Array.isArray(holes)) {
            return res.status(400).json({ message: 'holes must be an array' });
        }
        await db.collection('courses').doc(req.params.id).update({ holes });
        return res.json({ message: `${holes.length} holes added`, holes });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding holes' });
    }
};

module.exports = { getCourses, getCourseById, createCourse, addHoles };
