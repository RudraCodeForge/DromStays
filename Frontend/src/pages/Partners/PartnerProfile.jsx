import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ProfessionalDetails from "./ProfessionalDetails";
import VerificationDetails from "./VerificationDetails";
import BankDetails from "./BankDetails";

import {
  submit_Partner_Profile,
  getPartnerProfile,
} from "../../services/Partner.service";

import styles from "../../styles/PartnerProfile.module.css";

import PageLoader from "../../components/PageLoader";
import PartnerProfileCard from "../../components/Partner/PartnerProfileCard";
import ProgressRapper from "../../components/ProgressRapper";

const PartnerProfile = () => {
  const navigate = useNavigate();

  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  // Fetch Partner Profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const profile = await getPartnerProfile();

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

  const stepData = {
    1: {
      title: "Professional Details",
      message: "Tell us about your professional services.",
    },
    2: {
      title: "Verification Details",
      message:
        "Share your verification documents so we can verify your profile.",
    },
    3: {
      title: "Bank Details",
      message: "Enter your bank details to receive payouts.",
    },
  };

  const { title: stepTitle, message: stepMessage } = stepData[step];

  if (loading || submitting) {
    return <PageLoader />;
  }

  if (partnerProfile) {
    return <PartnerProfileCard profile={partnerProfile.data} />;
  }

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
