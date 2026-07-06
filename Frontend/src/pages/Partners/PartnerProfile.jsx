import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ProfessionalDetails from "./ProfessionalDetails";
import VerificationDetails from "./VerificationDetails";
import BankDetails from "./BankDetails";

import {
  submit_Partner_Profile,
  getPartnerProfile,
} from "../../services/Partner.service";

import styles from "../../styles/PartnerProfile.module.css";
import { initialPartnerData } from "./partnerInitialState";

import PageLoader from "../../components/PageLoader";
import PartnerProfileCard from "../../components/Partner/PartnerProfileCard";
import ProgressRapper from "../../components/ProgressRapper";

const TOTAL_STEPS = 3;

const STEP_DATA = {
  1: {
    title: "Professional Details",
    message: "Tell us about your professional services.",
  },
  2: {
    title: "Verification Details",
    message: "Share your verification documents so we can verify your profile.",
  },
  3: {
    title: "Bank Details",
    message: "Enter your bank details to receive payouts.",
  },
};

const PartnerProfile = () => {
  const navigate = useNavigate();

  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [partnerProfile, setPartnerProfile] = useState(null);
  const [partnerData, setPartnerData] = useState(initialPartnerData);

  const { title: stepTitle, message: stepMessage } = STEP_DATA[step];

  // Authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (role !== "partner") {
      navigate("/unauthorized");
    }
  }, [isAuthenticated, role, navigate]);

  // Fetch Partner Profile
  const fetchPartnerProfile = async () => {
    try {
      setLoading(true);

      const profile = await getPartnerProfile();

      if (profile?.success) {
        setPartnerProfile(profile.data);
      }
    } catch (error) {
      console.error("Error fetching partner profile:", error);
      toast.error("Failed to fetch partner profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerProfile();
  }, []);

  const updatePartnerData = (newData) => {
    setPartnerData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const submitPartnerProfile = async () => {
    try {
      setSubmitting(true);

      const res = await submit_Partner_Profile(partnerData);

      if (!res?.success) {
        toast.error(res?.message || "Failed to submit profile");
        return;
      }

      toast.success("Profile submitted successfully");

      await fetchPartnerProfile();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return <PageLoader />;
  }

  if (partnerProfile) {
    return <PartnerProfileCard profile={partnerProfile} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>{stepTitle}</h1>
          <p>{stepMessage}</p>
        </div>

        <ProgressRapper step={step} />

        <div className={styles.stepInfo}>
          Step {step} of {TOTAL_STEPS}
        </div>

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
              submitting={submitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerProfile;
