const sgMail = require("@sendgrid/mail");
const { S_GRID_API_KEY } = require("../config");
const moment = require("moment");

sgMail.setApiKey(S_GRID_API_KEY);

const sendWelcomeEmail = (email, notification) => {
  sgMail.send({
    to: email,
    from: "kandhlovuie@gmail.com",
    subject: notification.subject,
    text: notification.description,
  });
};

const sendInvitationEmail = (email, notification) => {
  sgMail.send({
    to: email,
    from: "kandhlovuie@gmail.com",
    subject: notification.subject,
    text: notification.description,
  });
};

const sendPasswordChangeConfirmation = async (email, notification) => {
  await sgMail
    .send({
      to: email,
      from: "kandhlovuie@gmail.com",
      subject: notification.subject,
      text: notification.description,
    })
    .then(() => true)
    .catch(() => false);
};

const sendResetPasswordEmail = async (config) => {
  const { email, token, tokenExpires, redirectLink } = config;

  await sgMail
    .send({
      to: email,
      from: "kandhlovuie@gmail.com",
      subject: "Reset your account password!",
      html:
        "<h4><b>Reset Password</b></h4>" +
        "<p>To reset your password, complete this form:</p>" +
        `<a href=${redirectLink}${token}>${redirectLink}${token}</a>` +
        "<br><br>" +
        `<p> Link expires at ${moment(tokenExpires)
          .startOf("hour")
          .fromNow()}!</p>` +
        "<p>--Task Monitor Team</p>",
    })
    .then(() => true)
    .catch(() => false);
};

module.exports = {
  sendWelcomeEmail,
  sendInvitationEmail,
  sendResetPasswordEmail,
  sendPasswordChangeConfirmation,
};
