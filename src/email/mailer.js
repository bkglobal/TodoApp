const nodemailer = require("nodemailer");
const path = require("path");

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "d1d022c5a1f57f", //generated by Mailtrap
    pass: "61ccb18566fa93", //generated by Mailtrap
  },
});

module.exports = {
  sendEmail(from, to, subject, html) {
    return new Promise((resolve, reject) => {
      transport.sendMail({ from, subject, to, html }, (err, info) => {
        if (err) {
          reject(err);
        }
        resolve(info);
      });
    });
  },
};