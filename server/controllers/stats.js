const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Enrollee = require('../models/Enrollee');
const Referral = require('../models/Referral');

// @desc      Get dashboard statistics
// @route     GET /api/v1/stats/dashboard
// @access    Private
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // Get total enrollees
  const totalEnrollees = await Enrollee.countDocuments();
  
  // Get active enrollees
  const activeEnrollees = await Enrollee.countDocuments({ status: 'active' });
  
  // Get pending enrollees
  const pendingEnrollees = await Enrollee.countDocuments({ status: 'pending' });
  
  // Get total by package
  const starterPackages = await Enrollee.countDocuments({ selectedPackage: 'starter' });
  const elitePackages = await Enrollee.countDocuments({ selectedPackage: 'elite' });
  const proPackages = await Enrollee.countDocuments({ selectedPackage: 'pro' });
  
  // Get team distribution
  const leftTeam = await Enrollee.countDocuments({ team: 'left' });
  const rightTeam = await Enrollee.countDocuments({ team: 'right' });
  
  // Get recent enrollees
  const recentEnrollees = await Enrollee.find()
    .sort('-createdAt')
    .limit(10);
  
  // Get payment stats
  const paidEnrollees = await Enrollee.countDocuments({ paymentCollected: true });
  const unpaidEnrollees = await Enrollee.countDocuments({ paymentCollected: false });
  
  // Get top referrers
  const topReferrers = await Referral.aggregate([
    {
      $group: {
        _id: '$referrer',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'enrollees',
        localField: '_id',
        foreignField: '_id',
        as: 'referrerDetails'
      }
    },
    { $unwind: '$referrerDetails' },
    {
      $project: {
        _id: 1,
        count: 1,
        name: '$referrerDetails.name',
        email: '$referrerDetails.email',
        referralId: '$referrerDetails.referralId'
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalEnrollees,
      activeEnrollees,
      pendingEnrollees,
      packageStats: {
        starter: starterPackages,
        elite: elitePackages,
        pro: proPackages
      },
      teamStats: {
        left: leftTeam,
        right: rightTeam
      },
      paymentStats: {
        paid: paidEnrollees,
        unpaid: unpaidEnrollees
      },
      recentEnrollees,
      topReferrers
    }
  });
});

// @desc      Get enrollment timeline
// @route     GET /api/v1/stats/timeline
// @access    Private
exports.getEnrollmentTimeline = asyncHandler(async (req, res, next) => {
  const { period } = req.query;
  let dateFormat;
  let startDate;
  const now = new Date();
  
  // Set date format and start date based on period
  switch(period) {
    case 'day':
      dateFormat = '%Y-%m-%d %H:00';
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      break;
    case 'week':
      dateFormat = '%Y-%m-%d';
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      break;
    case 'month':
      dateFormat = '%Y-%m-%d';
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case 'year':
      dateFormat = '%Y-%m';
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    default:
      dateFormat = '%Y-%m-%d';
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
  }
  
  const timeline = await Enrollee.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  res.status(200).json({
    success: true,
    data: timeline
  });
});

// @desc      Get team distribution statistics
// @route     GET /api/v1/stats/teams
// @access    Private
exports.getTeamDistribution = asyncHandler(async (req, res, next) => {
  // Get team distribution by package
  const teamPackageDistribution = await Enrollee.aggregate([
    {
      $group: {
        _id: {
          team: '$team',
          package: '$selectedPackage'
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.team': 1, '_id.package': 1 } }
  ]);
  
  // Get team distribution by status
  const teamStatusDistribution = await Enrollee.aggregate([
    {
      $group: {
        _id: {
          team: '$team',
          status: '$status'
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.team': 1, '_id.status': 1 } }
  ]);
  
  // Get team growth over time
  const today = new Date();
  const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  
  const teamGrowth = await Enrollee.aggregate([
    {
      $match: {
        createdAt: { $gte: oneMonthAgo }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          team: '$team'
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.date': 1, '_id.team': 1 } }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      teamPackageDistribution,
      teamStatusDistribution,
      teamGrowth
    }
  });
});

// @desc      Get package statistics
// @route     GET /api/v1/stats/packages
// @access    Private
exports.getPackageStats = asyncHandler(async (req, res, next) => {
  // Get package distribution
  const packageDistribution = await Enrollee.aggregate([
    {
      $group: {
        _id: '$selectedPackage',
        count: { $sum: 1 }
      }
    }
  ]);
  
  // Calculate revenue by package
  const packageRevenue = await Enrollee.aggregate([
    {
      $group: {
        _id: '$selectedPackage',
        revenue: { $sum: '$packagePrice' }
      }
    }
  ]);
  
  // Get package trend over time
  const today = new Date();
  const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
  
  const packageTrend = await Enrollee.aggregate([
    {
      $match: {
        createdAt: { $gte: threeMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          package: '$selectedPackage'
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.month': 1, '_id.package': 1 } }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      packageDistribution,
      packageRevenue,
      packageTrend
    }
  });
});

// @desc      Get leaderboard
// @route     GET /api/v1/stats/leaderboard
// @access    Private
exports.getLeaderboard = asyncHandler(async (req, res, next) => {
  // Get top referrers (people who referred the most)
  const topReferrers = await Referral.aggregate([
    {
      $group: {
        _id: '$referrer',
        referrals: { $sum: 1 }
      }
    },
    { $sort: { referrals: -1 } },
    { $limit: 20 },
    {
      $lookup: {
        from: 'enrollees',
        localField: '_id',
        foreignField: '_id',
        as: 'referrerDetails'
      }
    },
    { $unwind: '$referrerDetails' },
    {
      $project: {
        _id: 1,
        referrals: 1,
        name: '$referrerDetails.name',
        email: '$referrerDetails.email',
        team: '$referrerDetails.team',
        position: '$referrerDetails.kongaLinePosition',
        referralId: '$referrerDetails.referralId'
      }
    }
  ]);
  
  // Get leaderboard by package (top people in each package)
  const packageLeaders = await Enrollee.aggregate([
    {
      $group: {
        _id: '$selectedPackage',
        enrollees: { $push: '$$ROOT' }
      }
    },
    {
      $project: {
        _id: 1,
        topEnrollees: { $slice: ['$enrollees', 5] }
      }
    }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      topReferrers,
      packageLeaders
    }
  });
});