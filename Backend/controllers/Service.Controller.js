const Service = require("../models/Services.js");

// Search for services based on criteria
exports.searchServices = async (req, res) => {
  try {
    const { service, location, date } = req.body;
    console.log("Search Criteria:", { service, location, date });
    res.status(200).json({
      message: "Search criteria received",
      data: { service, location, date },
    });
  } catch (error) {
    console.error("Error searching services:", error);
    res.status(500).json({ message: "Error searching services" });
  }
};
