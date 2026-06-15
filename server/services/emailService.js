import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const createTransporter = () => {
  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS.replace(/\s/g, ''),
    },
  });
};

export const sendLoginOtpEmail = async ({ to, name, otp }) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[EMAIL NOT CONFIGURED] Login OTP for ${to}: ${otp}`);
    return;
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

export const sendRegisterOtpEmail = async ({ to, name, otp }) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[EMAIL NOT CONFIGURED] Register OTP for ${to}: ${otp}`);
    return;
  }

  await transporter.sendMail({
    from: env.EMAIL_FROM || env.EMAIL_USER,
    to,
    subject: 'Verify your AI Mock Interview account',
    text: `Hi ${name || 'there'}, your account verification OTP is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <p>Hi ${name || 'there'},</p>
        <p>Your account verification OTP is:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });
};
