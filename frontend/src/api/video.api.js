import axios from "axios";
import { BACKEND_URL } from "../config/api";

export const getSignedUploadUrl = async (fileName) => {
  const response = await axios.post(
    `${BACKEND_URL}/video/upload-url`,
    {
      fileName,
    }
  );

  return response.data;
};


export const uploadVideoToSupabase = async (
  signedUrl,
  videoFile,setUploadProgress
) => {
  const response = await axios.put(
    signedUrl,
    videoFile,
    {
      headers: {
        "Content-Type": videoFile.type,
      },

      onUploadProgress : (progressEvent) => {
        const uploadProgressInPercentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(uploadProgressInPercentage)
      }
    }
  );

  return response.data;
};

export const completeVideoUpload = async (
  videoId,
  mimeType,
  fileSize
) => {
  const response = await axios.post(
    `${BACKEND_URL}/video/${videoId}/complete`,
    {
      mimeType,
      fileSize,
    }
  );

  return response.data;
};

export const getUploadedVideos = async () => {
  const response = await axios.get(`${BACKEND_URL}/video`);

  return response.data;
};

export const getVideoById = async (videoId) => {
  const response = await axios.get(
    `${BACKEND_URL}/video/${videoId}`
  );

  return response.data;
};