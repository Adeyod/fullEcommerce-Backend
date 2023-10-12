import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const verifyEmail = async (email, link) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.SECURE,
      service: process.env.SERVICE,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.USER,
        pass: process.env.PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.USER, // sender address
      to: email, // list of receivers

      subject: 'Verify Email', // Subject line
      text: 'Welcome', // plain text body
      html: `
      <div>
      <p>Thank you for registering. Please verify your account as this link expires in 30 mins</p>
      <a href=${link}>Click Here to verify your email</a>
      </div>
      `, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
  } catch (error) {
    console.log(error);
    return;
  }
};

const passwordReset = async (email, link) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.SECURE,
      service: process.env.SERVICE,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.USER,
        pass: process.env.PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.USER, // sender address
      to: email, // list of receivers

      subject: 'Reset password', // Subject line
      text: 'Welcome', // plain text body
      html: `
      <div>
      <p>This message was sent for you to reset your password. It expires in 10mins.</p>
      <a href=${link}>Click Here to reset your password</a>
      </div>
      `, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
  } catch (error) {
    console.log(error);
    return;
  }
};

const paymentSuccess = async (email, link) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.SECURE,
      service: process.env.SERVICE,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.USER,
        pass: process.env.PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.USER, // sender address
      to: email, // list of receivers

      subject: 'Payment Successful', // Subject line
      text: 'Welcome', // plain text body
      html: `
      <div>
      <p>You have successfully paid for the products</p>
      </div>
      `, // html body
      // <a href=${link}>Click Here to reset your password</a>
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
  } catch (error) {
    console.log(error);
    return;
  }
};

export { verifyEmail, passwordReset, paymentSuccess };
