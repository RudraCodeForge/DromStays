const calculateRentDue = ({
  billingType,
  rentAmount,
  daysStayed = 0,
  advanceAmount = 0,
  advanceAdjusted = 0,
}) => {
  let totalRent = 0;

  if (billingType === "daily") {
    totalRent = rentAmount * daysStayed;
  }

  if (billingType === "monthly") {
    totalRent = rentAmount;
  }

  const remainingAdvance = advanceAmount - advanceAdjusted;

  const finalDue = Math.max(totalRent - remainingAdvance, 0);

  return {
    totalRent,
    finalDue,
    advanceUsed: totalRent > remainingAdvance ? remainingAdvance : totalRent,
  };
};

module.exports = { calculateRentDue };
