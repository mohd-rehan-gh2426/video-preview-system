import supabase from "../config/supabase.js";

export const completeVideoUpload = async (
  videoId,
  mimeType,
  fileSize
) => {
  const { data, error } = await supabase
    .from("videos")
    .update({
      status: "UPLOADED",
      mime_type: mimeType,
      file_size: fileSize,
      updated_at: new Date().toISOString(),
    })
    .eq("id", videoId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};