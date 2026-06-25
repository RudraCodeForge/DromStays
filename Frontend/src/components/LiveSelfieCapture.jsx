import { useRef, useState, useEffect } from "react";
import styles from "../styles/PartnerProfile.module.css";

const LiveSelfieCapture = ({ updateData }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [captured, setCaptured] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      alert("Unable to access camera");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], `live-selfie-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        updateData({
          liveSelfie: file,
        });

        setImageUrl(URL.createObjectURL(blob));
        setCaptured(true);

        stopCamera();
      },
      "image/jpeg",
      0.8,
    );
  };

  const retakePhoto = () => {
    setCaptured(false);
    setImageUrl("");

    updateData({
      liveSelfie: null,
    });

    startCamera();
  };

  return (
    <div className={styles.selfieContainer}>
      {!captured ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              borderRadius: "10px",
            }}
          />

          <button
            type="button"
            className={styles.nextBtn}
            onClick={capturePhoto}
          >
            📸 Capture Selfie
          </button>
        </>
      ) : (
        <>
          <img
            src={imageUrl}
            alt="Captured Selfie"
            style={{
              width: "100%",
              borderRadius: "10px",
            }}
          />

          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={retakePhoto}
          >
            Retake Selfie
          </button>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default LiveSelfieCapture;
