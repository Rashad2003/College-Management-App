import twilio from "twilio";

const accountSid = "AC074dd3572aaa5244becad17820a03489";
const authToken = "f76a9af3a5d73f8139b5510f436db777";
const fromNumber = +19786449234;

const client = twilio(accountSid, authToken);

export const sendSMS = async (to, message) => {
  try {
    const res = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    });
    console.log("✅ SMS sent:", res.sid);
    console.log("From:", fromNumber, "To:", to);

    return { success: true };
  } catch (err) {
    console.error("❌ SMS error:", err);
    return { success: false, error: err.message };
  }
};
