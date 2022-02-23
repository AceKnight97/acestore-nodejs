const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerifyEmail = async (email, code) => {
  const mailOptions = {
    from: "aceknight03@gmail.com",
    to: email,
    subject: "Save Money Verifying New Account",
    text: `Thanks for signing up. 
    Please verify your email address. Code ${code}`,
    html: `<strong>Thanks for signing up. 
    Please verify your email address. Code ${code}</strong>`,
  };
  try {
    return await sgMail.send(mailOptions);
  } catch (error) {
    console.log("Failed to send verify email: ", error);
    throw error;
  }
};

const sendForgotPassword = async (email, code) => {
  const mailOptions = {
    from: "aceknight03@gmail.com",
    to: email,
    subject: "Save Money Forgot Password",
    text: `Change Password with Code: ${code}`,
    html: `<strong>Change Password with Code: ${code}</strong>`,
  };
  try {
    return await sgMail.send(mailOptions);
  } catch (error) {
    console.log("Failed to send forgot email: ", error);
    throw error;
  }
};

module.exports = {
  sendVerifyEmail,
  sendForgotPassword,
};
