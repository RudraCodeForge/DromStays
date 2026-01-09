const Contact = require("../models/Contact");
const {
  sendContactConfirmationEmail,
  sendContactSupportEmail,
} = require("../utils/sendEmail");

const Ticket = require("../models/Ticket");
const TicketMessage = require("../models/TicketMessage");

const { logActivity } = require("../services/activity.service");

const SupportEmail = process.env.SUPPORT_EMAIL || "jitandradaksh533@gmail.com";

const resolvePriority = (category) => {
  switch (category) {
    case "payment":
      return "high";

    case "booking":
    case "tenant":
      return "medium";

    case "account":
    case "other":
    default:
      return "low";
  }
};

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

exports.createTicket = async (req, res) => {
  try {
    const { category, subject, message } = req.body;

    const userId = req.user._id;
    const role = req.user.Role;

    if (!category || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Category, subject and message are required.",
      });
    }

    // 🧠 priority decided by backend
    const priority = resolvePriority(category);

    const ticketCount = await Ticket.countDocuments();
    const ticketId = `DST-${1000 + ticketCount + 1}`;

    const newTicket = await Ticket.create({
      ticketId,
      user: userId,
      role,
      category,
      subject,
      message,
      priority,
    });

    await TicketMessage.create({
      ticket: newTicket._id,
      sender: "user",
      message,
    });

    await logActivity({
      owner: userId,
      entityType: "SERVICE",
      entityId: newTicket._id,
      action: "CREATED",
      message: `Created support ticket ${ticketId}`,
      meta: { ticketId },
    });

    return res.status(201).json({
      success: true,
      message: "Support ticket created successfully.",
      data: {
        ticketId: newTicket.ticketId,
        priority,
        status: newTicket.status,
      },
    });
  } catch (error) {
    console.error("createTicket error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const userId = req.user._id;
    const tickets = await Ticket.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    console.error("getTickets error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getTicketDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { ticketId } = req.params;
    const ticket = await Ticket.findOne({ _id: ticketId, user: userId });
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }
    const messages = await TicketMessage.find({ ticket: ticket._id }).sort({
      createdAt: 1,
    });
    return res.status(200).json({
      success: true,
      data: {
        ticket,
        messages,
      },
    });
  } catch (error) {
    console.error("getTicketDetails error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.sendTicketMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { ticketId } = req.params;
    const { message } = req.body;
    const ticket = await Ticket.findOne({ _id: ticketId, user: userId });
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }
    const newMessage = await TicketMessage.create({
      ticket: ticket._id,
      sender: "user",
      message,
    });
    await logActivity({
      owner: userId,
      entityType: "SERVICE",
      entityId: ticket._id,
      action: "UPDATED",
      message: `Added message to support ticket ${ticket.ticketId}`,
      meta: { ticketId: ticket.ticketId },
    });
    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("sendTicketMessage error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
