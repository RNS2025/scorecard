const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse, addHoles } = require('../controllers/courseController');
const { getGameById, createGame, updateGame } = require('../controllers/gameController');

// Course Routes
router.get('/courses', getCourses);
router.get('/courses/:id', getCourseById);
router.post('/courses', createCourse);
router.put('/courses/:id/holes', addHoles);

// Game Routes
router.get('/games/:id', getGameById);
router.post('/games', createGame);
router.put('/games/:id', updateGame);

module.exports = router;
