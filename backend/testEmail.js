// testEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";


const testEmail = async () => {

  try {
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tricoders3@gmail.com',
        pass: 'mhvu dfvx yolh ftqh',
      },
    });
    

    // Compose the email
    const mailOptions = {
      from: 'tricoders3@gmail.com',
      to:"ichrafkhalfaoui1@gmail.com",
      subject: 'test',
      html: `
      test
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Error sending password reset email');
  }
};

testEmail();
