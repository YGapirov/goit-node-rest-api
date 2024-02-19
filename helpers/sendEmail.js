const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASSWORD } = process.env;
const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "usergoit@meta.ua",
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async ({ to, subject, text, html, from = "usergoit@meta.ua" }) => {
  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    return { ok: true };
  } catch (err) {
    throw err;
  }
};
module.exports = sendEmail;
