exports.Verify_Coupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    console.log("Received coupon code:", couponCode);

    // Check if the coupon exists in the database
    if (couponCode === "DISCOUNT10") {
      return res.status(200).json({
        success: true,
        message: "You will get a discount of 10% upto 14000 ",
        discount: 10,
        maxDiscount: 14000,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid coupon code",
    });
  } catch (error) {
    console.error("Error occurred while verifying coupon:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
