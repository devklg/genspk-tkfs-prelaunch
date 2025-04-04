const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate a PDF document
 * @param {Object} data Data to include in the PDF
 * @param {String} templateName Name of the template to use
 * @param {String} filename Filename for the generated PDF
 * @returns {Promise} Promise with the filepath of the generated PDF
 */
const generatePDF = (data, templateName, filename) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const filepath = path.join(__dirname, '..', 'public', 'pdfs', filename);
      
      // Pipe the PDF into a file
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);
      
      // Apply the template
      switch(templateName) {
        case 'enrollee':
          generateEnrolleeTemplate(doc, data);
          break;
        case 'receipt':
          generateReceiptTemplate(doc, data);
          break;
        case 'report':
          generateReportTemplate(doc, data);
          break;
        default:
          generateDefaultTemplate(doc, data);
      }
      
      // Finalize the PDF
      doc.end();
      
      stream.on('finish', () => {
        resolve(filepath);
      });
      
      stream.on('error', (err) => {
        reject(err);
      });
      
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Generate template for enrollee details
 * @param {PDFDocument} doc PDFDocument instance
 * @param {Object} data Enrollee data
 */
const generateEnrolleeTemplate = (doc, data) => {
  // Add company logo
  doc.image(path.join(__dirname, '..', 'public', 'images', 'logo.png'), 50, 45, { width: 100 })
    .fillColor('#444444')
    .fontSize(20)
    .text('Kevin\'s Konga Pre-Enrollment', 160, 80)
    .fontSize(10)
    .text('Talk Fusion Video Email', 200, 65, { align: 'right' })
    .text('Pre-Launch Opportunity', 200, 80, { align: 'right' })
    .moveDown();
  
  // Add horizontal line
  doc.strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, 120)
    .lineTo(550, 120)
    .stroke()
    .moveDown();
  
  // Add enrollee details
  doc.fontSize(16)
    .fillColor('#0066cc')
    .text('Enrollee Information', { align: 'center' })
    .moveDown();
  
  doc.fontSize(12)
    .fillColor('#444444');
  
  // Table for enrollee data
  const tableTop = 180;
  const tableLeft = 50;
  const colWidth = 150;
  const rowHeight = 25;
  
  // Headers
  doc.font('Helvetica-Bold')
    .text('Field', tableLeft, tableTop)
    .text('Value', tableLeft + colWidth, tableTop);
  
  // Horizontal line after headers
  doc.strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(tableLeft, tableTop + 15)
    .lineTo(tableLeft + colWidth * 2, tableTop + 15)
    .stroke();
  
  // First row
  doc.font('Helvetica')
    .text('Name', tableLeft, tableTop + rowHeight)
    .text(data.name, tableLeft + colWidth, tableTop + rowHeight);
  
  // Second row
  doc.text('Email', tableLeft, tableTop + rowHeight * 2)
    .text(data.email, tableLeft + colWidth, tableTop + rowHeight * 2);
  
  // Third row
  doc.text('Phone', tableLeft, tableTop + rowHeight * 3)
    .text(data.phone, tableLeft + colWidth, tableTop + rowHeight * 3);
  
  // Fourth row
  doc.text('Package', tableLeft, tableTop + rowHeight * 4)
    .text(data.selectedPackage.toUpperCase(), tableLeft + colWidth, tableTop + rowHeight * 4);
  
  // Fifth row
  doc.text('Position', tableLeft, tableTop + rowHeight * 5)
    .text(`#${data.kongaLinePosition} in Konga Line`, tableLeft + colWidth, tableTop + rowHeight * 5);
  
  // Sixth row
  doc.text('Team', tableLeft, tableTop + rowHeight * 6)
    .text(data.team.toUpperCase(), tableLeft + colWidth, tableTop + rowHeight * 6);
  
  // Seventh row
  doc.text('Status', tableLeft, tableTop + rowHeight * 7)
    .text(data.status.toUpperCase(), tableLeft + colWidth, tableTop + rowHeight * 7);
  
  // Eighth row
  doc.text('Referral ID', tableLeft, tableTop + rowHeight * 8)
    .text(data.referralId, tableLeft + colWidth, tableTop + rowHeight * 8);
  
  // Ninth row
  doc.text('Enrollment Date', tableLeft, tableTop + rowHeight * 9)
    .text(new Date(data.createdAt).toLocaleDateString(), tableLeft + colWidth, tableTop + rowHeight * 9);
  
  // Add footer
  const pageHeight = doc.page.height;
  doc.fontSize(10)
    .text(
      'This document is confidential and contains proprietary information.',
      50,
      pageHeight - 50,
      { align: 'center', width: 500 }
    );
};

/**
 * Generate template for receipt
 * @param {PDFDocument} doc PDFDocument instance
 * @param {Object} data Receipt data
 */
const generateReceiptTemplate = (doc, data) => {
  // Add header
  doc.fontSize(20)
    .fillColor('#0066cc')
    .text('Payment Receipt', { align: 'center' })
    .moveDown();
  
  // Add receipt details
  doc.fontSize(12)
    .fillColor('#444444')
    .text(`Receipt Number: ${data.receiptNumber}`)
    .text(`Date: ${new Date(data.date).toLocaleDateString()}`)
    .text(`Customer: ${data.customerName}`)
    .moveDown()
    .text(`Package: ${data.package.toUpperCase()}`)
    .text(`Amount: $${data.amount.toFixed(2)}`)
    .text(`Payment Method: ${data.paymentMethod}`)
    .moveDown()
    .text('Thank you for your purchase!', { align: 'center' })
    .moveDown()
    .text('Kevin\'s Konga Pre-Enrollment', { align: 'center' });
};

/**
 * Generate template for reports
 * @param {PDFDocument} doc PDFDocument instance
 * @param {Object} data Report data
 */
const generateReportTemplate = (doc, data) => {
  // Add header
  doc.fontSize(20)
    .fillColor('#0066cc')
    .text(`${data.title}`, { align: 'center' })
    .moveDown();
  
  // Add subtitle
  doc.fontSize(14)
    .fillColor('#666666')
    .text(`${data.subtitle}`, { align: 'center' })
    .moveDown();
  
  // Add report date range
  doc.fontSize(12)
    .fillColor('#444444')
    .text(`Report Period: ${data.startDate} to ${data.endDate}`)
    .text(`Generated On: ${new Date().toLocaleString()}`)
    .moveDown();
  
  // Add report content
  doc.fontSize(12)
    .text('Summary', { underline: true })
    .moveDown();
  
  // Add summary data
  Object.entries(data.summary).forEach(([key, value]) => {
    doc.text(`${key}: ${value}`);
  });
  
  doc.moveDown()
    .text('Details', { underline: true })
    .moveDown();
  
  // Add details (this could be a table, list, etc. depending on the data)
  if (data.details && Array.isArray(data.details)) {
    data.details.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.label}: ${item.value}`);
    });
  }
  
  // Add notes if any
  if (data.notes) {
    doc.moveDown()
      .text('Notes', { underline: true })
      .moveDown()
      .text(data.notes);
  }
  
  // Add footer
  const pageHeight = doc.page.height;
  doc.fontSize(10)
    .text(
      'This report is generated from Kevin\'s Konga Pre-Enrollment System.',
      50,
      pageHeight - 50,
      { align: 'center', width: 500 }
    );
};

/**
 * Generate default template
 * @param {PDFDocument} doc PDFDocument instance
 * @param {Object} data Data for the PDF
 */
const generateDefaultTemplate = (doc, data) => {
  // Add title
  doc.fontSize(20)
    .fillColor('#0066cc')
    .text('Kevin\'s Konga Document', { align: 'center' })
    .moveDown();
  
  // Add content
  doc.fontSize(12)
    .fillColor('#444444');
  
  if (typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`);
    });
  } else {
    doc.text(String(data));
  }
  
  // Add footer
  const pageHeight = doc.page.height;
  doc.fontSize(10)
    .text(
      'Generated from Kevin\'s Konga Pre-Enrollment System',
      50,
      pageHeight - 50,
      { align: 'center', width: 500 }
    );
};

module.exports = generatePDF;