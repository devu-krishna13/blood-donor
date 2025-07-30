const nodemailer = require('nodemailer');
const Doner = require('../models/DonerModel'); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
   secure: true,
  tls: {
    rejectUnauthorized: false
  }
});

exports.sendEmergencyRequestToDoners = async (bloodRequest) => {
  try {
    const eligibleDoners = await Doner.find({
      eligibility: true 
    });

    console.log(eligibleDoners);

    if (!eligibleDoners.length) {
      console.log('No eligible donors found');
      return;
    }

    const mailOptions = {
      from: `Blood Donation System <${process.env.EMAIL_USER}>`,
      subject: `URGENT: Blood Donation Request - ${bloodRequest.BloodType} Needed`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">URGENT BLOOD DONATION REQUEST</h2>
          <div style="background-color: #ffebee; padding: 20px; border-radius: 5px;">
            <p><strong>Patient Name:</strong> ${bloodRequest.PatientName}</p>
            <p><strong>Blood Type Needed:</strong> <span style="color: #d32f2f; font-weight: bold;">${bloodRequest.BloodType}</span></p>
            <p><strong>Units Required:</strong> ${bloodRequest.UnitsRequired}</p>
            <p><strong>Status:</strong> <span style="color: ${bloodRequest.Status === 'Emergency' ? '#d32f2f' : '#fb8c00'}; font-weight: bold;">${bloodRequest.Status}</span></p>
            <p><strong>Doctor:</strong> ${bloodRequest.doctorName}</p>
            <p><strong>Specialization:</strong> ${bloodRequest.specialization}</p>
            <p><strong>Date Needed:</strong> ${new Date(bloodRequest.Date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${bloodRequest.Time}</p>
            <p><strong>Location:</strong> ${bloodRequest.address}</p>
            <p><strong>Contact Number:</strong> ${bloodRequest.ContactNumber}</p>
          </div>
          <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <p style="font-weight: bold;">This is an urgent request. If you're able to help, please respond immediately.</p>
            <p>Your donation can save a life!</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #757575;">
            You received this email because you're registered as a Blood Donor Availability System (BDAS). 
            To update your preferences, please contact our support team.
          </p>
        </div>
      `
    };

    const sendEmailPromises = eligibleDoners.map(doner => {
      return transporter.sendMail({
        ...mailOptions,
        to: doner.Email,
        html: mailOptions.html.replace('<h2>', `<h2>Dear ${doner.FullName || 'Valued Donor'},<br/>`) 
      });
    });

    await Promise.all(sendEmailPromises);
    console.log(`Sent ${eligibleDoners.length} emergency notification emails`);

  } catch (error) {
    console.error('Error sending emergency emails:', error);
    throw error;
  }
};