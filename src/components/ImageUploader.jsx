import React, { useState } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";


const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      // Get a presigned URL from your backend
      const { data } = await axios.get(`${API_BASE_URL}/api/s3-url`, {
        params: { 
          filename: file.name,
          content_type: file.type // Pass the real file type!
        }
      });

      // Upload file to S3
      await axios.put(data.url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      const s3Url = data.url.split("?")[0]; // Strip query params
      setMessage("Upload successful!");
      console.log("S3 URL:", s3Url);

      // You can now call a backend endpoint to update DynamoDB with s3Url

    } catch (err) {
      console.error(err);
      setMessage("Upload failed.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload an Image</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="Preview" width="200" />}
      <button onClick={handleUpload} disabled={!file} style={{ marginTop: "1rem" }}>
        Upload
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ImageUploader;
