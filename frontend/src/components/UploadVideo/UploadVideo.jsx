import React, { useState } from "react";
import {
  getSignedUploadUrl,
  uploadVideoToSupabase,
  completeVideoUpload,
} from "../../api/video.api";
import "./UploadVideo.css";
import { toast } from "sonner";

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
      toast.success("Video has been uploaded successfully");

      // Step 3: Tell backend the upload completed
      await completeVideoUpload(
        uploadData.videoId,
        selectedVideo.type,
        selectedVideo.size,
      );
      setSelectedVideo(null);
      setUploadProgress(0);

      console.log("Upload completed successfully");
    } catch (error) {
      toast.error(error?.message || "Upload failed. Please try again.");
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-card">
      <h1 className="upload-title">Upload a video</h1>
      <p className="upload-subtitle">
        Pick a file and we'll stream it straight to secure storage.
      </p>

      <label className="upload-drop">
        <span className="upload-drop-icon">📁</span>
        <span className="upload-drop-main">
          {selectedVideo
            ? "Choose a different video"
            : "Click to select a video"}
        </span>
        <span className="upload-drop-hint">
          MP4, MOV, WebM — any video format
        </span>
        <input type="file" accept="video/*" onChange={handleChange} />
      </label>

      {selectedVideo && (
        <div className="upload-meta">
          <p>
            <span>File name</span> <strong>{selectedVideo.name}</strong>
          </p>
          <p>
            <span>File type</span> <strong>{selectedVideo.type}</strong>
          </p>
          <p>
            <span>File size</span>{" "}
            <strong>
              {(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB
            </strong>
          </p>
        </div>
      )}

      <button
        className="upload-btn"
        onClick={handleClick}
        disabled={isUploading || !selectedVideo}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      {isUploading && (
        <div className="upload-progress">
          <div className="upload-progress-track">
            <div
              className="upload-progress-bar"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="upload-progress-label">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadVideo;
