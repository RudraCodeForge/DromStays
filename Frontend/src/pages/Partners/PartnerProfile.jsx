import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ProfessionalDetails from "./ProfessionalDetails";
import VerificationDetails from "./VerificationDetails";
import BankDetails from "./BankDetails";

import {
  submit_Partner_Profile,
  CheckPartnerProfile,
  getPartnerProfile,
  updateVerification,
} from "../../services/Partner.service";

import styles from "../../styles/PartnerProfile.module.css";

import PageLoader from "../../components/PageLoader";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import PartnerProfileCard from "../../components/Partner/PartnerProfileCard";
import ProgressRapper from "../../components/ProgressRapper";

const PartnerProfile = () => {
  const navigate = useNavigate();

  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [partnerProfile, setPartnerProfile] = useState(null);

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

  // Authentication Check
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (role !== "partner") {
      navigate("/unauthorized");
    }
  }, [isAuthenticated, role, navigate]);

  // Fetch Profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [profileCheck, profile] = await Promise.all([
          CheckPartnerProfile(),
          getPartnerProfile(),
        ]);

        if (profileCheck?.success && profileCheck?.profileExists) {
          setProfileExists(true);
        }

        if (profile?.success) {
          setPartnerProfile(profile);
        }
      } catch (error) {
        console.error("Error fetching partner profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

        const profile = await getPartnerProfile();

        if (profile?.success) {
          setPartnerProfile(profile);
        }
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

  const submitVerification = async () => {
    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("partnerId", partnerProfile.data.partner._id);

      if (partnerData.liveSelfie) {
        formData.append("liveSelfie", partnerData.liveSelfie);
      }

      if (partnerData.aadhaarFront) {
        formData.append("aadhaarFront", partnerData.aadhaarFront);
      }

      if (partnerData.aadhaarBack) {
        formData.append("aadhaarBack", partnerData.aadhaarBack);
      }

      const res = await updateVerification(formData);

      if (res.success) {
        alert("Verification submitted successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };
  // Rejected Profile
  if (partnerProfile?.data?.verification?.status === "rejected") {
    return (
      <>
        <Navbar />

        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h1>Verification Rejected</h1>

              <p>
                Your verification documents were rejected. Please upload them
                again.
              </p>

              <div
                style={{
                  background: "#ffe8e8",
                  color: "#d32f2f",
                  padding: "12px",
                  borderRadius: "8px",
                  marginTop: "15px",
                  fontWeight: 500,
                }}
              >
                Reason: {partnerProfile.data.verification.rejectionReason}
              </div>
            </div>

            <VerificationDetails
              mode="edit"
              profile={partnerProfile.data}
              data={partnerData}
              updateData={updatePartnerData}
              submitVerification={submitVerification}
            />
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // Profile Already Exists
  if (profileExists) {
    return (
      <>
        <Navbar />

        <div className={styles.container}>
          <PartnerProfileCard profile={partnerProfile?.data} />
        </div>

        <Footer />
      </>
    );
  }

  // New Profile Form
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>{stepTitle}</h1>
          <p>{stepMessage}</p>
        </div>

        <ProgressRapper step={step} />

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
              mode="create"
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
