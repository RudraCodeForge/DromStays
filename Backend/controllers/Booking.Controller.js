const RoomBooking = require("../models/RoomBooking");
const Tenant = require("../models/Tenant");

exports.GET_ALL_BOOKINGS = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.Role;

        let bookings = [];

        /* 🔹 OWNER */
        if (role === "owner") {
            bookings = await RoomBooking.find({ owner: userId })
                .populate("room")
                .populate("tenant")
                .populate("owner")
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                role: "owner",
                bookings,
            });
        }

        /* 🔹 TENANT */
        if (role === "tenant") {
            const tenant = await Tenant.findOne({ user: userId });
            if (!tenant) {
                return res.status(200).json({
                    success: true,
                    role: "tenant",
                    bookings: [], // ✅ EMPTY ARRAY, NOT ERROR
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
        }

        /* 🔹 UNKNOWN ROLE */
        return res.status(403).json({
            success: false,
            message: "Unauthorized role",
        });

    } catch (error) {
        console.error("GET_ALL_BOOKINGS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
