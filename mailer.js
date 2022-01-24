const core = require('@actions/core');
const moment = require('moment');
const nodemailer = require('nodemailer');

const LIST_OF_RECEIVERS = core.getInput('receivers').split(':');
const MAILER_PASSWORD = core.getInput('mailer_password');
const MAILER_SENDER = core.getInput('mailer_sender');
const NODEMAILER_HOST = core.getInput('nodemailer_host');
const NODEMAILER_PORT = Number(core.getInput('nodemailer_port'));

const transporter = nodemailer.createTransport({
  host: NODEMAILER_HOST,
  port: NODEMAILER_PORT,
  secure: NODEMAILER_PORT === 465 ? true : false, // true for 465, false for other ports
  auth: {
    user: MAILER_SENDER,
    pass: MAILER_PASSWORD,
  },
});

const sendEmailAlert = async (message) => {
  try {
    const info = await transporter.sendMail({
      from: `"Github Push Bot (@ZCorp)" <${MAILER_SENDER}>`,
      to: LIST_OF_RECEIVERS,
      subject: `Github Push Bot: ${moment().format(
        'YYYY-MM-DD HH:mm:ss'
      )} on repository: ${core.getInput('repo')}`,
      text: message,
    });

    return info.messageId;
  } catch (error) {
    return { message: 'An error occured while sending the mail' };
  }
};

exports.sendEmailAlert = sendEmailAlert;
