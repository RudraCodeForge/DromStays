const RoomBooking = require("../models/RoomBooking");
const Tenant = require("../models/Tenant");

exports.GET_ALL_BOOKINGS = async (req, res) => {
    try {
        const userId = req.user.id;

        let bookings = [];

        /* 🔍 CASE 1: USER IS OWNER */
        bookings = await RoomBooking.find({ owner: userId })
            .populate("room")
            .populate("tenant")
            .populate("owner")
            .sort({ createdAt: -1 });

        if (bookings.length > 0) {
            return res.status(200).json({
                success: true,
                role: "owner",
                bookings,
            });
        }

        /* 🔍 CASE 2: USER IS TENANT (linked via Tenant.user) */
        const tenant = await Tenant.findOne({ user: userId });

        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "No bookings found for this user",
            });
        }

        bookings = await RoomBooking.find({ tenant: tenant._id })
            .populate("room")
            .populate("tenant")
            .populate("owner")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            role: "tenant",
            bookings,
        });

    } catch (error) {
        console.error("GET_ALL_BOOKINGS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
