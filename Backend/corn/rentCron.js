const bookings = await RoomBooking.find({ status: "active" });

for (const booking of bookings) {
  if (new Date() >= booking.nextDueDate) {
    booking.totalDue += booking.rentAmount;

    // 🔥 Adjust advance automatically
    const adjustment = Math.min(
      booking.advanceAmount - booking.advanceAdjusted,
      booking.rentAmount
    );

    booking.advanceAdjusted += adjustment;
    booking.totalDue -= adjustment;

    booking.lastRentPaidDate = new Date();

    booking.nextDueDate = calculateNextDueDate({
      bookingDate: booking.nextDueDate,
      billingType: booking.billingType,
      billingCycleDay: booking.billingCycleDay,
    });

    await booking.save();
  }
}
