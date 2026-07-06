import styles from "../../styles/PartnerProfileCard.module.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer";
import { NavLink } from "react-router-dom";

const PartnerProfileCard = ({ profile }) => {
  const { partner, bank, verification } = profile || {};

  if (!partner) {
    return (
      <>
        <Navbar />
        <div className={styles.emptyProfile}>
          <h2>No Profile Found</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.avatar}>
              {partner.contactPerson?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2>{partner.businessName}</h2>
              <p>{partner.serviceCategory}</p>

              <span
                className={`${styles.badge} ${
                  partner.isVerified ? styles.verified : styles.notVerified
                }`}
              >
                {partner.isVerified ? "Verified" : "Pending Verification"}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className={styles.progressSection}>
            <p>Profile Completion</p>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${partner.completepercentage}%`,
                }}
              ></div>
            </div>

            <span>{partner.completepercentage}%</span>
          </div>

          {/* Partner Details */}
          <div className={styles.section}>
            <h3>Professional Details</h3>

            <div className={styles.grid}>
              <div>
                <strong>Contact Person</strong>
                <p>{partner.contactPerson}</p>
              </div>

              <div>
                <strong>City</strong>
                <p>{partner.city}</p>
              </div>

              <div>
                <strong>Experience</strong>
                <p>{partner.experience} Years</p>
              </div>

              <div>
                <strong>Service Radius</strong>
                <p>{partner.serviceRadius} KM</p>
              </div>

              <div>
                <strong>Working Hours</strong>
                <p>{partner.workingHours}</p>
              </div>

              <div>
                <strong>Languages</strong>
                <p>{partner.languages?.join(", ")}</p>
              </div>

              <div className={styles.fullWidth}>
                <strong>Skills</strong>
                <p>{partner.skills?.join(", ")}</p>
              </div>
            </div>
          </div>

          {/* Bank */}
          <div className={styles.section}>
            <h3>Bank Details</h3>

            <div className={styles.grid}>
              <div>
                <strong>Account Holder</strong>
                <p>{bank?.accountHolderName}</p>
              </div>

              <div>
                <strong>Bank</strong>
                <p>{bank?.bankName}</p>
              </div>

              <div>
                <strong>Account Number</strong>
                <p>{bank?.accountNumber}</p>
              </div>

              <div>
                <strong>IFSC</strong>
                <p>{bank?.ifscCode}</p>
              </div>

              <div className={styles.fullWidth}>
                <strong>UPI ID</strong>
                <p>{bank?.upiId}</p>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className={styles.section}>
            <h3>KYC Details</h3>

            <div className={styles.grid}>
              <div>
                <strong>Aadhaar</strong>
                <p>{verification?.addharno}</p>
              </div>

              <div>
                <strong>PAN</strong>
                <p>{verification?.panNo}</p>
              </div>

              <div>
                <strong>GST</strong>
                <p>{verification?.gstno}</p>
              </div>

              <div>
                <strong>Status</strong>

                <span
                  className={`${styles.status} ${
                    verification?.status === "approved"
                      ? styles.approved
                      : verification?.status === "rejected"
                        ? styles.rejected
                        : styles.pending
                  }`}
                >
                  {verification?.status}
                </span>
              </div>

              {verification?.status === "rejected" && (
                <div className={`${styles.fullWidth} ${styles.rejectionBox}`}>
                  <strong>Rejection Reason</strong>
                  <p>{verification?.rejectionReason}</p>

                  <NavLink
                    to="/Partner/RejectedProfile"
                    className={styles.resubmitBtn}
                  >
                    ReSubmit Verification
                  </NavLink>
                </div>
              )}
            </div>

            <div className={styles.imageGrid}>
              <div>
                <p>Aadhaar Front</p>
                <img src={verification?.aadhaarFrontUrl} alt="Aadhaar Front" />
              </div>

              <div>
                <p>Aadhaar Back</p>
                <img src={verification?.aadhaarBackUrl} alt="Aadhaar Back" />
              </div>

              <div>
                <p>Live Selfie</p>
                <img src={verification?.liveSelfieUrl} alt="Selfie" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PartnerProfileCard;
