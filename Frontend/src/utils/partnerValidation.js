// GST Number validation (15 characters: 2 state code + 10 PAN + 1 entity + 2 checksum)
export const validateGST = (gst) => {
  const gstRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

// Aadhaar validation (12 digits)
export const validateAadhaar = (aadhaar) => {
  const aadhaarRegex = /^[0-9]{12}$/;
  return aadhaarRegex.test(aadhaar);
};

// PAN validation (10 characters format: AAAAA9999A)
export const validatePAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

// Bank account number validation (basic: 9-18 digits)
export const validateAccountNumber = (accountNumber) => {
  const accountRegex = /^[0-9]{9,18}$/;
  return accountRegex.test(accountNumber);
};

// IFSC code validation (11 characters: 4 letters + 0 + 6 characters)
export const validateIFSC = (ifsc) => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc);
};

// UPI ID validation
export const validateUPI = (upi) => {
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
  return upiRegex.test(upi);
};

// Indian Banks with IFSC prefix mapping
export const INDIAN_BANKS = [
  { name: "State Bank of India", ifscPrefix: "SBIN" },
  { name: "HDFC Bank", ifscPrefix: "HDFC" },
  { name: "ICICI Bank", ifscPrefix: "ICIC" },
  { name: "Axis Bank", ifscPrefix: "UTIB" },
  { name: "Kotak Mahindra Bank", ifscPrefix: "KKBK" },
  { name: "IndusInd Bank", ifscPrefix: "INDB" },
  { name: "Punjab National Bank", ifscPrefix: "PUNB" },
  { name: "Bank of Baroda", ifscPrefix: "BARB" },
  { name: "Union Bank of India", ifscPrefix: "UBIN" },
  { name: "Bank of India", ifscPrefix: "BKID" },
  { name: "Canara Bank", ifscPrefix: "CNRB" },
  { name: "Central Bank of India", ifscPrefix: "CBIN" },
  { name: "Idbi Bank", ifscPrefix: "IBKL" },
  { name: "Yes Bank", ifscPrefix: "YESB" },
  { name: "Airtel Payments Bank", ifscPrefix: "AIRP" },
  { name: "Bandhan Bank", ifscPrefix: "BDBL" },
  { name: "Bharat Bank", ifscPrefix: "BBKM" },
  { name: "CSB Bank", ifscPrefix: "CSBE" },
  { name: "DCB Bank", ifscPrefix: "DCBL" },
  { name: "Dhanlaxmi Bank", ifscPrefix: "DLXB" },
  { name: "Federal Bank", ifscPrefix: "FEDB" },
  { name: "HDBANK", ifscPrefix: "HDFC" },
  { name: "HSBC India", ifscPrefix: "HSBC" },
  { name: "Icici Prudential Bank", ifscPrefix: "ICIC" },
  { name: "Jammu And Kashmir Bank", ifscPrefix: "JAKA" },
  { name: "Karur Vysya Bank", ifscPrefix: "KVBL" },
  { name: "Lakshmi Vilas Bank", ifscPrefix: "LAVB" },
  { name: "Nainital Bank", ifscPrefix: "NAIN" },
  { name: "RBL Bank", ifscPrefix: "RATN" },
  { name: "South Indian Bank", ifscPrefix: "SIBL" },
  { name: "Tamilnad Mercantile Bank", ifscPrefix: "TMBL" },
  { name: "The Cosmos Co-operative Bank", ifscPrefix: "COSB" },
  { name: "Utkarsh Small Finance Bank", ifscPrefix: "UTKS" },
];

// Get bank name from IFSC code prefix
export const getBankNameByIFSC = (ifsc) => {
  if (!ifsc || ifsc.length < 4) return null;
  const prefix = ifsc.substring(0, 4).toUpperCase();
  const bank = INDIAN_BANKS.find((b) => b.ifscPrefix === prefix);
  return bank ? bank.name : null;
};

// Get list of unique bank names
export const getBankList = () => {
  const uniqueBanks = [...new Set(INDIAN_BANKS.map((b) => b.name))];
  return uniqueBanks.sort();
};
