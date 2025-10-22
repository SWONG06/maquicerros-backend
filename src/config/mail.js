import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const mailTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendMail = async (to, subject, html) => {
  return await mailTransport.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
};
