const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendVerifyEmail(email, code) {
  const mailOptions = {
    from: 'quangdao@itrvn.com',
    to: email,
    subject: 'Save Money Verifying New Account',
    text: `Thanks for signing up. 
    Please verify your email address. Code ${code}`,
    html: `<strong>Thanks for signing up. 
    Please verify your email address. Code ${code}</strong>`,
  };
  return sgMail.send(mailOptions);
}

function sendForgotPassword(email, code) {
  const mailOptions = {
    from: 'quangdao@itrvn.com',
    to: email,
    subject: 'Save Money Forgot Password',
    text: `Change Password with Code: ${code}`,
    html: `<strong>Change Password with Code: ${code}</strong>`,
  };
  return sgMail.send(mailOptions);
}

export default { sendVerifyEmail, sendForgotPassword };
