import Styles from "../../styles/CancellationPolicy.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer.jsx";

const CancellationPolicy = () => {
  return (
    <>
      <Navbar />
      <div className={Styles.wrapper}>
        {/* HEADER */}
        <section className={Styles.header}>
          <h1>Cancellation Policy</h1>
          <p>
            We understand that plans can change. Learn about our flexible
            cancellation policies and how to manage your bookings.
          </p>
          <small>Last updated: August 15, 2026</small>
        </section>

        {/* OVERVIEW */}
        <section className={Styles.section}>
          <h2>Overview</h2>
          <p>
            Dromstays is committed to providing a fair and transparent
            cancellation policy for all users. Our policy is designed to protect
            both guests and hosts while allowing flexibility when unexpected
            situations arise.
          </p>
          <div className={Styles.highlight}>
            <strong>💡 Note:</strong> Cancellation policies may vary by listing.
            Always check the specific property's cancellation terms before
            booking.
          </div>
        </section>

        {/* TENANT CANCELLATIONS */}
        <section className={Styles.section}>
          <h2>1. Tenant/Guest Cancellations</h2>

          <div className={Styles.policyCard}>
            <h3>Free Cancellation</h3>
            <p className={Styles.timeline}>Up to 14 days before check-in</p>
            <p>
              Cancel your booking for free with full refund of the amount paid,
              minus any applicable platform fees.
            </p>
            <ul>
              <li>Full refund issued within 5-7 business days</li>
              <li>Platform service fee is non-refundable</li>
              <li>No questions asked</li>
            </ul>
          </div>

          <div className={Styles.policyCard}>
            <h3>50% Refund</h3>
            <p className={Styles.timeline}>7-14 days before check-in</p>
            <p>
              Cancel within this period and receive 50% of the booking amount as
              refund.
            </p>
            <ul>
              <li>50% refund issued within 5-7 business days</li>
              <li>50% retained by property owner</li>
              <li>Non-transferable to other bookings</li>
            </ul>
          </div>

          <div className={Styles.policyCard}>
            <h3>No Refund</h3>
            <p className={Styles.timeline}>Within 7 days of check-in</p>
            <p>
              Cancellations made within 7 days of check-in are not refundable.
            </p>
            <ul>
              <li>Full amount retained by property owner</li>
              <li>No exceptions for this period</li>
              <li>
                Consider purchasing Dromstays Protection Plan for coverage
              </li>
            </ul>
          </div>
        </section>

        {/* SPECIAL CIRCUMSTANCES */}
        <section className={Styles.section}>
          <h2>2. Special Circumstances & Refunds</h2>
          <p>
            We understand that emergencies happen. Under the following
            circumstances, you may be eligible for exceptions:
          </p>

          <div className={Styles.circumstanceList}>
            <div className={Styles.circumstanceItem}>
              <strong>Health Emergency</strong>
              <p>
                Medical issues, hospitalizations, or health-related emergencies
                with valid documentation
              </p>
            </div>
            <div className={Styles.circumstanceItem}>
              <strong>Family Emergency</strong>
              <p>
                Death, serious injury, or family crisis requiring immediate
                presence
              </p>
            </div>
            <div className={Styles.circumstanceItem}>
              <strong>Natural Disasters</strong>
              <p>
                Weather events, floods, earthquakes, or other natural calamities
                affecting travel
              </p>
            </div>
            <div className={Styles.circumstanceItem}>
              <strong>Travel Restrictions</strong>
              <p>
                Government-imposed travel bans or restrictions preventing travel
              </p>
            </div>
            <div className={Styles.circumstanceItem}>
              <strong>Job Loss</strong>
              <p>Unexpected job loss with verified documentation</p>
            </div>
          </div>

          <div className={Styles.highlight} style={{ marginTop: "20px" }}>
            <strong>How to Request:</strong> Contact our support team with valid
            documentation within 48 hours of the cancellation. Our team will
            review and respond within 3-5 business days.
          </div>
        </section>

        {/* OWNER CANCELLATIONS */}
        <section className={Styles.section}>
          <h2>3. Property Owner Cancellations</h2>
          <p>
            Property owners are expected to honor confirmed bookings.
            Cancellations by owners may result in penalties:
          </p>
          <ul>
            <li>
              <strong>First Cancellation:</strong> Warning and suspension from
              featured listings for 30 days
            </li>
            <li>
              <strong>Second Cancellation:</strong> 25% penalty on booking
              amount + 60-day suspension
            </li>
            <li>
              <strong>Third Cancellation:</strong> 50% penalty + account review
              and possible suspension
            </li>
            <li>
              <strong>Emergency Cancellations:</strong> May be exempt if
              property becomes unavailable due to maintenance or natural
              disasters (with proof)
            </li>
          </ul>

          <div className={Styles.highlight} style={{ marginTop: "20px" }}>
            <strong>Guest Compensation:</strong> When an owner cancels, the
            guest receives full refund plus a 10% Dromstays credit for
            rebooking.
          </div>
        </section>

        {/* REFUND PROCESS */}
        <section className={Styles.section}>
          <h2>4. Refund Process & Timeline</h2>

          <div className={Styles.stepsList}>
            <div className={Styles.step}>
              <div className={Styles.stepNumber}>1</div>
              <div>
                <strong>Request Cancellation</strong>
                <p>
                  Cancel through your Dromstays dashboard or contact support
                </p>
              </div>
            </div>

            <div className={Styles.step}>
              <div className={Styles.stepNumber}>2</div>
              <div>
                <strong>Confirmation</strong>
                <p>
                  You'll receive cancellation confirmation via email with refund
                  details
                </p>
              </div>
            </div>

            <div className={Styles.step}>
              <div className={Styles.stepNumber}>3</div>
              <div>
                <strong>Processing</strong>
                <p>Refund is processed within 5-7 business days</p>
              </div>
            </div>

            <div className={Styles.step}>
              <div className={Styles.stepNumber}>4</div>
              <div>
                <strong>Credit</strong>
                <p>
                  Amount appears in your original payment method or Dromstays
                  wallet
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MODIFICATION */}
        <section className={Styles.section}>
          <h2>5. Modifications vs. Cancellations</h2>
          <p>
            Changing your check-in date, duration, or room selection is
            different from cancellation:
          </p>
          <ul>
            <li>
              <strong>Date Modification:</strong> May be possible with 14+ days
              notice (charges may apply based on new dates)
            </li>
            <li>
              <strong>Room Upgrade:</strong> Available if the upgraded room is
              available (additional charges apply)
            </li>
            <li>
              <strong>Early Checkout:</strong> Non-refundable; no refund issued
              for unused nights
            </li>
            <li>
              <strong>Late Checkout:</strong> Subject to availability;
              additional charges apply
            </li>
          </ul>

          <p
            style={{ marginTop: "15px", fontStyle: "italic", color: "#94a3b8" }}
          >
            Contact our support team before your booking date to discuss
            possible modifications.
          </p>
        </section>

        {/* PROTECTION PLAN */}
        <section className={Styles.section}>
          <h2>6. Dromstays Protection Plan</h2>
          <p>
            Protect your booking with our optional Protection Plan for added
            peace of mind:
          </p>

          <div className={Styles.protectionTable}>
            <div className={Styles.tableRow}>
              <div>
                <strong>Coverage</strong>
              </div>
              <div>
                <strong>Price</strong>
              </div>
              <div>
                <strong>Refund Eligibility</strong>
              </div>
            </div>
            <div className={Styles.tableRow}>
              <div>Standard Protection</div>
              <div>₹99-499</div>
              <div>100% refund up to 3 days before check-in</div>
            </div>
            <div className={Styles.tableRow}>
              <div>Premium Protection</div>
              <div>₹499-999</div>
              <div>100% refund up to check-in day</div>
            </div>
            <div className={Styles.tableRow}>
              <div>Full Coverage</div>
              <div>₹999+</div>
              <div>100% refund anytime + emergency support 24/7</div>
            </div>
          </div>

          <p
            style={{ marginTop: "15px", fontSize: "0.95rem", color: "#cbd5f5" }}
          >
            Protection Plans must be purchased at the time of booking. Learn
            more details in your booking confirmation.
          </p>
        </section>

        {/* NON-REFUNDABLE */}
        <section className={Styles.section}>
          <h2>7. Non-Refundable Items</h2>
          <p>
            The following are not eligible for refunds under any circumstances:
          </p>
          <ul>
            <li>
              Dromstays platform service fees (₹0-500 based on booking value)
            </li>
            <li>Payment processing fees</li>
            <li>Add-on services (cleaning, laundry, meals)</li>
            <li>Premium services or amenity charges</li>
            <li>Bookings cancelled within 7 days of check-in</li>
          </ul>
        </section>

        {/* DISPUTES */}
        <section className={Styles.section}>
          <h2>8. Dispute Resolution</h2>
          <p>If you disagree with a cancellation decision or refund amount:</p>
          <ol>
            <li>
              Contact our support team with relevant documentation within 14
              days
            </li>
            <li>
              Our team will review your case and respond within 5 business days
            </li>
            <li>
              If unresolved, the matter can be escalated to our Disputes Team
            </li>
            <li>Final decision will be communicated within 10 business days</li>
          </ol>

          <div className={Styles.contactInfo}>
            <p>
              <strong>Support Email:</strong> support@dromstays.com
            </p>
            <p>
              <strong>Support Phone:</strong> +91-XXX-XXXX-XXXX
            </p>
            <p>
              <strong>Response Time:</strong> Within 24 hours during business
              days
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className={Styles.section}>
          <h2>9. Frequently Asked Questions</h2>

          <div className={Styles.faqItem}>
            <h4>Q: Can I cancel on the day of check-in?</h4>
            <p>
              A: Yes, but it will be classified as a no-refund cancellation.
              You'll lose your entire booking amount.
            </p>
          </div>

          <div className={Styles.faqItem}>
            <h4>Q: How long does refund processing take?</h4>
            <p>
              A: Refunds are typically processed within 5-7 business days.
              During holidays, it may take up to 10 days.
            </p>
          </div>

          <div className={Styles.faqItem}>
            <h4>Q: Can I transfer my booking to someone else?</h4>
            <p>
              A: Transfers are not permitted. You must cancel and the new guest
              must create a fresh booking.
            </p>
          </div>

          <div className={Styles.faqItem}>
            <h4>Q: What if the property owner cancels?</h4>
            <p>
              A: You receive full refund plus a 10% Dromstays credit for
              inconvenience. We'll help you find an alternative.
            </p>
          </div>

          <div className={Styles.faqItem}>
            <h4>Q: Are service add-ons refundable?</h4>
            <p>
              A: No, add-on services (breakfast, cleaning, tours) are
              non-refundable even if you cancel the main booking.
            </p>
          </div>

          <div className={Styles.faqItem}>
            <h4>Q: Can I get a refund if the room conditions are poor?</h4>
            <p>
              A: Yes. If the room doesn't match the listing photos or has
              maintenance issues, contact support immediately for a refund or
              rebooking.
            </p>
          </div>
        </section>

        {/* IMPORTANT NOTES */}
        <section className={Styles.section}>
          <h2>10. Important Notes</h2>
          <div className={Styles.importantBox}>
            <ul>
              <li>All times mentioned are in IST (Indian Standard Time)</li>
              <li>Policy effective from August 15, 2026 onwards</li>
              <li>
                Dromstays reserves the right to modify this policy with 30 days
                notice
              </li>
              <li>
                This policy applies to all users across all regions in India
              </li>
              <li>
                Legal disputes are subject to Indian laws and jurisdiction
              </li>
              <li>
                For corporate bookings, special cancellation terms may apply -
                contact sales@dromstays.com
              </li>
            </ul>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <section className={Styles.footer}>
          <p>
            Still have questions? Contact our support team anytime. We're here
            to help!
          </p>
          <p className={Styles.footerHighlight}>
            Email: support@dromstays.com | Phone: +91-XXX-XXXX-XXXX
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default CancellationPolicy;
