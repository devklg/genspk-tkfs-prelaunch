const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Enrollee = require('../models/Enrollee');
const Referral = require('../models/Referral');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// @desc      Get all enrollees
// @route     GET /api/v1/enrollees
// @access    Private
exports.getEnrollees = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single enrollee
// @route     GET /api/v1/enrollees/:id
// @access    Private
exports.getEnrollee = asyncHandler(async (req, res, next) => {
  const enrollee = await Enrollee.findById(req.params.id);

  if (!enrollee) {
    return next(
      new ErrorResponse(`Enrollee not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: enrollee
  });
});

// @desc      Create new enrollee
// @route     POST /api/v1/enrollees
// @access    Public (for pre-enrollment)
exports.createEnrollee = asyncHandler(async (req, res, next) => {
  // Get position in Konga line
  const enrolleeCount = await Enrollee.countDocuments();
  req.body.kongaLinePosition = enrolleeCount + 1;
  
  // Create enrollee
  const enrollee = await Enrollee.create(req.body);
  
  // If there's a sponsor, create a referral relationship
  if (req.body.sponsorReferralId) {
    const sponsor = await Enrollee.findOne({ 
      referralId: req.body.sponsorReferralId 
    });
    
    if (sponsor) {
      await Referral.create({
        referrer: sponsor._id,
        referred: enrollee._id,
        status: 'completed'
      });
    }
  }

  res.status(201).json({
    success: true,
    data: enrollee
  });
});

// @desc      Update enrollee
// @route     PUT /api/v1/enrollees/:id
// @access    Private
exports.updateEnrollee = asyncHandler(async (req, res, next) => {
  let enrollee = await Enrollee.findById(req.params.id);

  if (!enrollee) {
    return next(
      new ErrorResponse(`Enrollee not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is enrollee owner or admin
  if (
    req.user.role !== 'admin' && 
    enrollee.email !== req.user.email
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this enrollee`,
        401
      )
    );
  }

  enrollee = await Enrollee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: enrollee
  });
});

// @desc      Delete enrollee
// @route     DELETE /api/v1/enrollees/:id
// @access    Private (Admin only)
exports.deleteEnrollee = asyncHandler(async (req, res, next) => {
  const enrollee = await Enrollee.findById(req.params.id);

  if (!enrollee) {
    return next(
      new ErrorResponse(`Enrollee not found with id of ${req.params.id}`, 404)
    );
  }

  await enrollee.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Get enrollees by team (left or right)
// @route     GET /api/v1/enrollees/team/:team
// @access    Private
exports.getEnrolleesByTeam = asyncHandler(async (req, res, next) => {
  const enrollees = await Enrollee.find({ team: req.params.team });

  res.status(200).json({
    success: true,
    count: enrollees.length,
    data: enrollees
  });
});

// @desc      Get enrollees by sponsor
// @route     GET /api/v1/enrollees/sponsor/:id
// @access    Private
exports.getEnrolleesBySponsor = asyncHandler(async (req, res, next) => {
  const referrals = await Referral.find({ referrer: req.params.id })
    .populate('referred');
  
  const enrollees = referrals.map(ref => ref.referred);

  res.status(200).json({
    success: true,
    count: enrollees.length,
    data: enrollees
  });
});

// @desc      Update enrollee payment info
// @route     PUT /api/v1/enrollees/:id/payment
// @access    Private
exports.updatePaymentInfo = asyncHandler(async (req, res, next) => {
  let enrollee = await Enrollee.findById(req.params.id);

  if (!enrollee) {
    return next(
      new ErrorResponse(`Enrollee not found with id of ${req.params.id}`, 404)
    );
  }

  const { cardType, lastFourDigits, expiryDate } = req.body;
  
  enrollee = await Enrollee.findByIdAndUpdate(
    req.params.id, 
    { 
      paymentCollected: true,
      paymentInfo: { cardType, lastFourDigits, expiryDate },
      status: 'active'
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: enrollee
  });
});

// @desc      Get enrollees statistics
// @route     GET /api/v1/enrollees/stats
// @access    Private
exports.getEnrolleesStats = asyncHandler(async (req, res, next) => {
  // Get total enrollees
  const totalEnrollees = await Enrollee.countDocuments();
  
  // Get enrollees by package
  const packageStats = await Enrollee.aggregate([
    {
      $group: {
        _id: '$selectedPackage',
        count: { $sum: 1 }
      }
    }
  ]);
  
  // Get enrollees by team
  const teamStats = await Enrollee.aggregate([
    {
      $group: {
        _id: '$team',
        count: { $sum: 1 }
      }
    }
  ]);
  
  // Get enrollees by status
  const statusStats = await Enrollee.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  // Get enrollees by country
  const countryStats = await Enrollee.aggregate([
    {
      $group: {
        _id: '$address.country',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  
  // Get enrollment timeline (by date)
  const today = new Date();
  const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  
  const dailyEnrollments = await Enrollee.aggregate([
    {
      $match: {
        createdAt: { $gte: oneMonthAgo }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalEnrollees,
      packageStats,
      teamStats,
      statusStats,
      countryStats,
      dailyEnrollments
    }
  });
});

// @desc      Generate and print enrollee details as PDF
// @route     GET /api/v1/enrollees/:id/print
// @access    Private
exports.printEnrolleeDetails = asyncHandler(async (req, res, next) => {
  const enrollee = await Enrollee.findById(req.params.id);

  if (!enrollee) {
    return next(
      new ErrorResponse(`Enrollee not found with id of ${req.params.id}`, 404)
    );
  }

  // Create a PDF document
  const doc = new PDFDocument();
  const filename = `enrollee-${enrollee._id}.pdf`;
  const filepath = path.join(__dirname, '..', 'public', 'pdfs', filename);
  
  // Pipe the PDF into a file
  doc.pipe(fs.createWriteStream(filepath));
  
  // Add content to the PDF
  doc.fontSize(20).text('Kevin\'s Konga Pre-Enrollment Details', {
    align: 'center'
  });
  
  doc.moveDown();
  doc.fontSize(14).text(`Enrollee: ${enrollee.name}`);
  doc.fontSize(12).text(`Email: ${enrollee.email}`);
  doc.fontSize(12).text(`Phone: ${enrollee.phone}`);
  doc.fontSize(12).text(`Konga Line Position: ${enrollee.kongaLinePosition}`);
  doc.fontSize(12).text(`Selected Package: ${enrollee.selectedPackage.toUpperCase()}`);
  doc.fontSize(12).text(`Team Placement: ${enrollee.team.toUpperCase()}`);
  doc.fontSize(12).text(`Status: ${enrollee.status.toUpperCase()}`);
  doc.fontSize(12).text(`Referral ID: ${enrollee.referralId}`);
  doc.fontSize(12).text(`Enrollment Date: ${enrollee.createdAt.toDateString()}`);
  
  doc.moveDown();
  doc.fontSize(14).text('Payment Status:');
  doc.fontSize(12).text(`Payment Collected: ${enrollee.paymentCollected ? 'Yes' : 'No'}`);
  
  if (enrollee.paymentCollected && enrollee.paymentInfo) {
    doc.fontSize(12).text(`Card Type: ${enrollee.paymentInfo.cardType}`);
    doc.fontSize(12).text(`Card Number: **** **** **** ${enrollee.paymentInfo.lastFourDigits}`);
    doc.fontSize(12).text(`Expiry Date: ${enrollee.paymentInfo.expiryDate}`);
  }
  
  doc.moveDown();
  doc.fontSize(14).text('Address:');
  if (enrollee.address) {
    if (enrollee.address.street) doc.fontSize(12).text(`Street: ${enrollee.address.street}`);
    if (enrollee.address.city) doc.fontSize(12).text(`City: ${enrollee.address.city}`);
    if (enrollee.address.state) doc.fontSize(12).text(`State: ${enrollee.address.state}`);
    if (enrollee.address.zip) doc.fontSize(12).text(`ZIP: ${enrollee.address.zip}`);
    if (enrollee.address.country) doc.fontSize(12).text(`Country: ${enrollee.address.country}`);
  }
  
  doc.moveDown();
  doc.fontSize(10).text('This document is generated from Kevin\'s Konga Pre-Enrollment System', {
    align: 'center'
  });
  doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, {
    align: 'center'
  });
  
  // Finalize the PDF
  doc.end();
  
  // Send the PDF
  res.status(200).json({
    success: true,
    data: {
      filename,
      url: `/pdfs/${filename}`
    }
  });
});
