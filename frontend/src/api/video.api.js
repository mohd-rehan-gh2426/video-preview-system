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