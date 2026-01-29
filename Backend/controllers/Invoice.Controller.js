const Invoice = require("../models/Invoice");

exports.getAllInvoices = async (req, res) => {
    try {
        const userId = req.user.id;

        const invoices = await Invoice.find({
            $or: [{ user: userId }, { owner: userId }],
        })
            .sort({ createdAt: -1 })
            .populate("user", "fullName email")
            .populate("owner", "fullName email");

        return res.status(200).json({
            success: true,
            invoices,
        });
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
