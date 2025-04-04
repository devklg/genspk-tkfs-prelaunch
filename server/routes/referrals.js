const express = require('express');
const {
  getReferrals,
  getReferral,
  createReferral,
  updateReferral,
  deleteReferral,
  getReferralsByReferrer,
  getReferralStats
} = require('../controllers/referrals');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getReferrals)
  .post(protect, createReferral);

router
  .route('/:id')
  .get(protect, getReferral)
  .put(protect, updateReferral)
  .delete(protect, authorize('admin'), deleteReferral);

router.route('/referrer/:id').get(protect, getReferralsByReferrer);
router.route('/stats').get(protect, getReferralStats);

module.exports = router;
