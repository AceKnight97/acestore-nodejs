const twilio = require("twilio");
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (from, to, body) => {
  try {
    await client.messages.create({ from, to, body });
  } catch (error) {
    throw error;
  }
};

const Vonage = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: "be010121",
  apiSecret: "T7TRlQBXp6TPNzqz",
});

const sendSMSNexmo = async (to, body) => {
  try {
    const from = "Vonage APIs";
    // const to = "84819541897";

    vonage.message.sendSms(from, to, body, (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        if (responseData.messages[0]["status"] === "0") {
          console.log("Message sent successfully.");
        } else {
          console.log(
            `Message failed with error: ${responseData.messages[0]["error-text"]}`
          );
        }
      }
    });
  } catch (error) {
    throw error;
  }
};

module.exports = sendSMSNexmo;
