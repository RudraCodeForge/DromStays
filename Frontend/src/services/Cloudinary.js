const uploadImageToCloudinary = async (file) => {
  if (!file) throw new Error("No file selected");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "profile_upload");
  formData.append("folder", "profile_pictures");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/de80xznxj/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  console.log("Cloudinary response:", data);

  if (!res.ok) {
    throw new Error(data.error?.message || "Upload failed");
  }

  return data.secure_url;
};

const Upload_Property_Images = async (file) => {
  if (!file) throw new Error("No file selected");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Property_upload");
  formData.append("folder", "Property_images");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/de80xznxj/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Upload failed");
  }

  // ✅ return both
  return {
    url: data.secure_url,
    public_id: data.public_id,
  };
};

export { Upload_Property_Images };

export { uploadImageToCloudinary };
