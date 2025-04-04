const express = require('express');
const {
  getEnrollees,
  getEnrollee,
  createEnrollee,
  updateEnrollee,
  deleteEnrollee,
  getEnrolleesByTeam,
  updatePaymentInfo,
  getEnrolleesStats,
  printEnrolleeDetails,
  getEnrolleesBySponsor
} = require('../controllers/enrollees');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getEnrollees)
  .post(createEnrollee);

router
  .route('/:id')
  .get(protect, getEnrollee)
  .put(protect, updateEnrollee)
  .delete(protect, authorize('admin'), deleteEnrollee);

router.route('/team/:team').get(protect, getEnrolleesByTeam);
router.route('/sponsor/:id').get(protect, getEnrolleesBySponsor);
router.route('/:id/payment').put(protect, updatePaymentInfo);
router.route('/stats').get(protect, getEnrolleesStats);
router.route('/:id/print').get(protect, printEnrolleeDetails);

module.exports = router;
