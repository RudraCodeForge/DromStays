const Partner = require("../models/Partner.js");
const Verification = require("../models/Verification.js");
const Consent = require("../models/Consent.js");
const BankDetails = require("../models/BankDetails.js");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

exports.submitPartnerProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const existingPartner = await Partner.findOne({ userId });

    if (existingPartner) {
      console.log(completepercentage, isVerified);
      return res.status(200).json({
        success: true,
        completepercentage,
        isVerified,
        message: "Partner profile already exists for this user.",
      });
    }

    if (
      !req.files?.aadhaarFront?.length ||
      !req.files?.aadhaarBack?.length ||
      !req.files?.liveSelfie
    ) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar front, back and live selfie files  are required.",
      });
    }

    // Upload both images simultaneously
    const [aadhaarFront, aadhaarBack, liveSelfie] = await Promise.all([
      uploadToCloudinary(
        req.files.aadhaarFront[0],
        `kyc/${userId}/aadhaar`,
        "aadhaar-front",
      ),
      uploadToCloudinary(
        req.files.aadhaarBack[0],
        `kyc/${userId}/aadhaar`,
        "aadhaar-back",
      ),
      uploadToCloudinary(
        req.files.liveSelfie[0],
        `kyc/${userId}/selfie`,
        "Live-Photo",
      ),
    ]);

    // Create Partner
    const partner = await Partner.create({
      userId,
      businessName: req.body.businessName,
      contactPerson: req.body.contactPerson,
      serviceCategory: req.body.serviceCategory,
      experience: req.body.experience,
      skills: req.body.skills,
      languages: req.body.languages,
      city: req.body.city,
      serviceRadius: req.body.serviceRadius,
      workingHours: req.body.workingHours,
      completepercentage: 100,
    });

    // Create remaining documents simultaneously
    await Promise.all([
      Verification.create({
        partnerId: partner._id,
        aadhaarFrontUrl: aadhaarFront.secure_url,
        aadhaarBackUrl: aadhaarBack.secure_url,
        liveSelfieUrl: liveSelfie.secure_url,
        addharno: req.body.aadhaarNumber,
        gstno: req.body.gstNumber,
        panNo: req.body.panNumber,
      }),

      Consent.create({
        userId,
        consentGiven: true,
        consentType: req.body.consentType || "dataProcessing",
      }),

      BankDetails.create({
        userId,
        accountHolderName: req.body.accountHolderName,
        accountNumber: req.body.accountNumber,
        ifscCode: req.body.ifscCode,
        bankName: req.body.bankName,
        upiId: req.body.upiId,
      }),

      Consent.create({
        userId,
        consentGiven: true,
        consentType: "bankDetails",
      }),
    ]);

    return res.status(201).json({
      success: true,
      message: "Partner profile created successfully.",
      aadhaarFrontUrl: aadhaarFront.secure_url,
      aadhaarBackUrl: aadhaarBack.secure_url,
    });
  } catch (error) {
    console.error("submitPartnerProfile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.CheckProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const existingPartner = await Partner.findOne({ userId });

    if (!existingPartner) {
      return res.status(200).json({
        success: true,
        profileExists: false,
      });
    }

    return res.status(200).json({
      success: true,
      profileExists: true,
      partnerId: existingPartner._id,
      isVerified: existingPartner.isVerified,
      completepercentage: existingPartner.completepercentage,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
