const cloudinary = require("../config/cloudinary");

const deleteFromCloudinary = async (publicId) => {
  if (!publicId || publicId === "default_Property_wazpgw") {
    return; // ❌ default image delete nahi karni
  }

  await cloudinary.uploader.destroy(publicId);
};

module.exports = {
  deleteFromCloudinary,
};
