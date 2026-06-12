import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const createTransporter = () => {
  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });
};

export const sendLoginOtpEmail = async ({ to, name, otp }) => {
  const transporter = createTransporter();
  if (!transporter) {
    throw new Error('Email is not configured');
  }

  await transporter.sendMail({
    from: env.EMAIL_FROM || env.EMAIL_USER,
    to,
    subject: 'Your AI Mock Interview sign-in OTP',
    text: `Hi ${name || 'there'}, your sign-in OTP is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <p>Hi ${name || 'there'},</p>
        <p>Your sign-in OTP is:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });
};
