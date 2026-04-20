const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse, addHoles } = require('../controllers/courseController');
const { getGameById, createGame, updateGame } = require('../controllers/gameController');
const { publishScores, getLeaderboard } = require('../controllers/leaderboardController');
const { getProfile, getAdminLeaderboard, getMarketingEmails, getAdminStats } = require('../controllers/adminController');
const { getAllUsers } = require('../controllers/userController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Course Routes
router.get('/courses', getCourses);
router.get('/courses/:id', getCourseById);
router.post('/courses', createCourse);
router.put('/courses/:id/holes', addHoles);

// Game Routes
router.get('/games/:id', getGameById);
router.post('/games', createGame);
router.put('/games/:id', updateGame);

// Leaderboard Routes
router.get('/leaderboard', getLeaderboard);
router.post('/leaderboard', publishScores);

// Admin Routes (protected)
router.get('/admin/profile', verifyAdmin, getProfile);
router.get('/admin/leaderboard', verifyAdmin, getAdminLeaderboard);
router.get('/admin/marketing-emails', verifyAdmin, getMarketingEmails);
router.get('/admin/stats', verifyAdmin, getAdminStats);

// User Routes
router.get('/users', getAllUsers);

module.exports = router;
