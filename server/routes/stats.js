const express = require('express');
const {
  getDashboardStats,
  getEnrollmentTimeline,
  getTeamDistribution,
  getPackageStats,
  getLeaderboard
} = require('../controllers/stats');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/timeline', getEnrollmentTimeline);
router.get('/teams', getTeamDistribution);
router.get('/packages', getPackageStats);
router.get('/leaderboard', getLeaderboard);

module.exports = router;