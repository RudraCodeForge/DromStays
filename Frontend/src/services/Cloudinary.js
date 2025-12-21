const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "profile_upload"); // MUST EXIST
  formData.append("folder", "profile_pictures");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/de80xznxj/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  console.log("Cloudinary Response:", data);

  if (!data.secure_url) {
    throw new Error(data.error?.message || "Upload failed");
  }

  return data.secure_url; // ✅ FINAL URL
};
export { uploadImageToCloudinary };
