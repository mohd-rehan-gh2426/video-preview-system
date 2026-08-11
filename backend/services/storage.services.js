import supabase from "../config/supabase.js";
import { v4 as uuidv4 } from "uuid";

export const generateUploadUrl = async (originalFileName) => {

  console.log("🔥 generateUploadUrl CALLED");

  if (!originalFileName) {
    throw new Error("Original filename is required.");
  }

  const videoId = uuidv4();

  // Get the file extension (e.g. mp4, mov, avi)
  const extension = originalFileName.split(".").pop();

  // Generate a unique filename
  const uniqueFileName = `${videoId}.${extension}`;

  // Store all original videos inside the "originals" folder
  const path = `originals/${uniqueFileName}`;

  // Generate a signed upload URL
  const { data, error } = await supabase.storage
    .from("videos")
    .createSignedUploadUrl(path);

  if (error) {
    throw error;
  }

  // Create database record
  const { error: databaseError } = await supabase.from("videos").insert({
    id: videoId,
    original_name: originalFileName,
    storage_path: path,
    status: "PENDING_UPLOAD",
  });
  console.log("VIDEO ID:", videoId);
  console.log("FILE NAME:", originalFileName);
  console.log("STORAGE PATH:", path);
  console.log("DATABASE INSERT ERROR:", databaseError);

  if (databaseError) {
    throw databaseError;
  }

  return {
    videoId,
    signedUrl: data.signedUrl,
    path,
  };
};
