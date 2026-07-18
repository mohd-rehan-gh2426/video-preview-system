import React, { useState } from "react";
import { getSignedUploadUrl, uploadVideoToSupabase } from "../../api/video.api";

const UploadVideo = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (event) => {
    const videoToUpload = event.target.files[0];
    setSelectedVideo(videoToUpload);
  };

  const handleClick = async () => {
    try {
      if (!selectedVideo) {
        alert("Please select a video");
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      // Step 1: Get signed URL
      const uploadData = await getSignedUploadUrl(selectedVideo.name);

      console.log("Signed URL received:", uploadData);

      // Step 2: Upload directly to Supabase
      await uploadVideoToSupabase(
        uploadData.signedUrl,
        selectedVideo,
        setUploadProgress,
      );

      console.log("Upload completed successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleChange} />
      {selectedVideo && (
        <div>
          <p>Selected File Name : {selectedVideo.name}</p>
          <p>Selected File Type : {selectedVideo.type}</p>
          <p>
            Selected File Size :{" "}
            {(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      )}
      <button onClick={handleClick} disabled={isUploading || !selectedVideo}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>
      {/* {isUploading && <p>Uploading: {uploadProgress}%</p>} */}
      {isUploading && (
        <div style={{ marginTop: "16px", width: "400px" }}>
          <div
            style={{
              width: "100%",
              height: "10px",
              backgroundColor: "#e5e7eb",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${uploadProgress}%`,
                height: "100%",
                backgroundColor: "#2563eb",
                transition: "width 0.2s ease",
              }}
            />
          </div>

          <p style={{ marginTop: "8px" }}>Uploading... {uploadProgress}%</p>
        </div>
      )}
    </div>
  );
};

export default UploadVideo;
