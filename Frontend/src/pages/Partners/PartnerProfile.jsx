import { useState, useEffect } from "react";
import ProfessionalDetails from "./ProfessionalDetails";
import VerificationDetails from "./VerificationDetails";
import BankDetails from "./BankDetails";
import {
  submit_Partner_Profile,
  CheckPartnerProfile,
} from "../../services/Partner.service";
import styles from "../../styles/PartnerProfile.module.css";
import PageLoader from "../../components/PageLoader";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProgrssRapper from "../../components/ProgressRapper";

const PartnerProfile = () => {
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (role !== "partner") {
      navigate("/unauthorized");
    }
  }, [isAuthenticated, role, navigate]);

  const [step, setStep] = useState(1);
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [partnerData, setPartnerData] = useState({
    businessName: "",
    contactPerson: "",
    serviceCategory: "",
    experience: "",
    skills: "",
    languages: "",
    workingHours: "",
    city: "",
    serviceRadius: "",

    gstNumber: "",
    aadhaarNumber: "",
    panNumber: "",
    aadhaarFront: null,
    aadhaarBack: null,
    liveSelfie: null,

    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await CheckPartnerProfile();

        if (res?.success && res?.profileExists) {
          setProfileExists(true);
        }
      } catch (error) {
        console.error("Error checking partner profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updatePartnerData = (newData) => {
    setPartnerData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const submitPartnerProfile = async () => {
    try {
      setSubmitting(true);
      const res = await submit_Partner_Profile(partnerData);

      if (res?.success) {
        alert("Profile Submitted Successfully");
        setProfileExists(true);
      } else {
        alert(res?.message || "Failed to submit profile");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const stepTitle =
    step === 1
      ? "Professional Details"
      : step === 2
        ? "Verification Details"
        : "Bank Details";

  const stepMessage =
    step === 1
      ? "Tell us about your professional services."
      : step === 2
        ? "Share your verification documents so we can verify your profile."
        : "Enter your bank details to receive payouts.";

  if (loading || submitting) {
    return <PageLoader />;
  }

  if (profileExists) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h1>Profile Already Created</h1>
              <p>
                Your partner profile has already been submitted and is under
                review or approved.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>{stepTitle}</h1>
          <p>{stepMessage}</p>
        </div>

        <ProgrssRapper step={step} />
        <div className={styles.stepInfo}>Step {step} of 3</div>

        <div className={styles.stepContent}>
          {step === 1 && (
            <ProfessionalDetails
              data={partnerData}
              updateData={updatePartnerData}
              nextStep={nextStep}
            />
          )}

          {step === 2 && (
            <VerificationDetails
              data={partnerData}
              updateData={updatePartnerData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}

          {step === 3 && (
            <BankDetails
              data={partnerData}
              updateData={updatePartnerData}
              prevStep={prevStep}
              submitProfile={submitPartnerProfile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerProfile;
