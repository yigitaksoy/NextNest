const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const nodemailer = require("nodemailer");
const ejs = require("ejs");

const sendEmail = (toEmail, listingData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  const emailTemplatePath = path.join(__dirname, "../views/listings.ejs");

  ejs.renderFile(emailTemplatePath, { listingData }, (error, renderedHtml) => {
    if (error) {
      console.log(error);
    } else {
      const mailOptions = {
        from: "NextNest <info@nextnest.com>",
        to: toEmail,
        subject: "New Listings",
        html: renderedHtml,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
  });
};

module.exports = sendEmail;
