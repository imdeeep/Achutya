const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER || 'koitobanda@gmail.com';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'pzqvcgpcizkhxccz';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

async function sendMail({ to, subject, html }) {
  const mailOptions = {
    from: `Achyutya Travel <${EMAIL_USER}>`,
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendMail }; 