const Contact = require("../models/Contact");
const {
  sendContactConfirmationEmail,
  sendContactSupportEmail,
} = require("../utils/sendEmail");

const SupportEmail = process.env.SUPPORT_EMAIL || "jitandradaksh533@gmail.com";

exports.contactSupport = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }
    // Save contact message to the database
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    // Send confirmation email to user
    await sendContactConfirmationEmail(email, name);

    // Send notification email to support team
    await sendContactSupportEmail(SupportEmail, name, email, message);

    return res.status(200).json({
      message:
        "Your message has been received. We will get back to you shortly.",
    });
  } catch (error) {
    console.error("contactSupport error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
