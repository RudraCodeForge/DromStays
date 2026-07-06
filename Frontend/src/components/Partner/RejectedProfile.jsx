import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer";
import PageLoader from "../PageLoader";
import VerificationDetails from "../../pages/Partners/VerificationDetails";

import {
  getPartnerProfile,
  updateVerification,
} from "../../services/Partner.service";

import styles from "../../styles/PartnerProfile.module.css";

const RejectedProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [partnerProfile, setPartnerProfile] = useState(null);

  const [partnerData, setPartnerData] = useState({
    gstNumber: "",
    aadhaarNumber: "",
    panNumber: "",
    aadhaarFront: null,
    aadhaarBack: null,
    liveSelfie: null,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await getPartnerProfile();

      if (!res?.success) {
        navigate("/Partner/Profile", { replace: true });
        return;
      }

      // Save Profile
      setPartnerProfile(res.data);

      // Allow only rejected profiles
      if (res.data?.verification?.status !== "rejected") {
        navigate("/Partner/Profile", { replace: true });
      }
    } catch (error) {
      console.error(error);
      navigate("/Partner/Profile", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const updatePartnerData = (newData) => {
    setPartnerData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const submitVerification = async () => {
    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("partnerId", partnerProfile.partner._id);

      if (partnerData.liveSelfie) {
        formData.append("liveSelfie", partnerData.liveSelfie);
      }

      if (partnerData.aadhaarFront) {
        formData.append("aadhaarFront", partnerData.aadhaarFront);
      }

      if (partnerData.aadhaarBack) {
        formData.append("aadhaarBack", partnerData.aadhaarBack);
      }

      // Optional (only if backend accepts these fields)
      formData.append(
        "gstNumber",
        partnerData.gstNumber || partnerProfile.verification.gstno,
      );

      formData.append(
        "aadhaarNumber",
        partnerData.aadhaarNumber || partnerProfile.verification.addharno,
      );

      formData.append(
        "panNumber",
        partnerData.panNumber || partnerProfile.verification.panNo,
      );

      const res = await updateVerification(formData);

      if (res?.success) {
        toast.success("Verification submitted successfully.");

        // Fetch latest profile
        await fetchProfile();

        navigate("/Partner/Profile", {
          replace: true,
        });
      } else {
        alert(res?.message || "Failed to submit verification.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || submitting) {
    return <PageLoader />;
  }

  if (!partnerProfile) {
    return null;
  }

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>Verification Rejected</h1>

            <p>
              Your verification documents were rejected. Please correct the
              issue and upload them again.
            </p>

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                borderRadius: "10px",
                background: "#ffe8e8",
                borderLeft: "5px solid #d32f2f",
                color: "#c62828",
                fontWeight: 500,
              }}
            >
              <strong>Reason :</strong>{" "}
              {partnerProfile.verification.rejectionReason}
            </div>
          </div>

          <VerificationDetails
            mode="edit"
            profile={partnerProfile}
            data={partnerData}
            updateData={updatePartnerData}
            submitVerification={submitVerification}
          />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RejectedProfile;
