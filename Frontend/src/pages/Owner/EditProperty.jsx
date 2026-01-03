import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload_Property_Images } from "../../services/Cloudinary";
import { Get_Property_By_Id } from "../../services/Properties";
import styles from "../../styles/EditProperty.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
const { isAuthenticated, user } = useSelector((state) => state.auth);
const navigate = useNavigate();
const EditProperty = () => {
  if (!isAuthenticated) {
    navigate("/login");
  }
  if (user?.role !== "Owner") {
    navigate("/");
  }
  const { propertyId } = useParams();
  const formRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);

  const [image, setImage] = useState({
    url: "",
    public_id: "",
  });

  // 🔹 GET PROPERTY DETAILS
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await Get_Property_By_Id(propertyId);
        const property = data.property;

        if (!formRef.current) return;

        formRef.current.name.value = property.name || "";
        formRef.current.propertyType.value = property.propertyType || "Hostel";
        formRef.current.totalRooms.value = property.totalRooms || 0;
        formRef.current.isActive.checked = property.isActive ?? false;

        setImage({
          url: property.images?.[0]?.url || "",
          public_id: property.images?.[0]?.public_id || "",
        });
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  // 🔹 IMAGE UPLOAD HANDLER
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImageUploading(true);

      const imageData = await Upload_Property_Images(file);
      setImage(imageData); // { url, public_id }

      console.log("Uploaded image:", imageData);
    } catch (err) {
      console.error("Image upload failed:", err.message);
    } finally {
      setImageUploading(false);
    }
  };

  // 🔹 SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = formRef.current;

    const payload = {
      name: form.name.value,
      propertyType: form.propertyType.value,
      totalRooms: Number(form.totalRooms.value),
      isActive: form.isActive.checked,
      images: [image],
    };

    console.log("UPDATE PAYLOAD 👉", payload);

    // 🔜 PUT API CALL HERE
    // await Update_Property_By_Id(propertyId, payload);
  };

  if (loading) {
    return <p className={styles.loading}>Loading property...</p>;
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.heading}>Edit Property</h2>

        <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
          {/* NAME */}
          <div className={styles.formGroup}>
            <label>Property Name</label>
            <input name="name" type="text" />
          </div>

          {/* TYPE */}
          <div className={styles.formGroup}>
            <label>Property Type</label>
            <select name="propertyType">
              <option value="Hostel">Hostel</option>
              <option value="PG">PG</option>
              <option value="Hotel">Hotel</option>
              <option value="Apartment">Apartment</option>
            </select>
          </div>

          {/* ROOMS */}
          <div className={styles.formGroup}>
            <label>Total Rooms</label>
            <input name="totalRooms" type="number" />
          </div>

          {/* ACTIVE */}
          <div className={styles.formGroupCheckbox}>
            <input name="isActive" type="checkbox" />
            <span>Property Active</span>
          </div>

          {/* IMAGE PREVIEW */}
          {image.url && (
            <div className={styles.imageBox}>
              <img src={image.url} alt="Property" />
            </div>
          )}

          {/* IMAGE UPLOAD */}
          <div className={styles.formGroup}>
            <label>Update Image</label>
            <input type="file" onChange={handleImageUpload} />

            {imageUploading && (
              <p className={styles.uploadingText}>Uploading image...</p>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={imageUploading}
          >
            {imageUploading ? "Uploading..." : "Update Property"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditProperty;
