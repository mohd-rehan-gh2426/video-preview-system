import supabase from "../config/supabase.js";
import { v4 as uuidv4 } from "uuid";

export const generateUploadUrl = async (originalFileName) => {
  if (!originalFileName) {
    throw new Error("Original filename is required.");
  }

  // Get the file extension (e.g. mp4, mov, avi)
  const extension = originalFileName.split(".").pop();

  // Generate a unique filename
  const uniqueFileName = `${uuidv4()}.${extension}`;

  // Store all original videos inside the "originals" folder
  const path = `originals/${uniqueFileName}`;

  // Generate a signed upload URL
  const { data, error } = await supabase.storage
    .from("videos")
    .createSignedUploadUrl(path);

  if (error) {
    throw error;
  }

  return data;
};