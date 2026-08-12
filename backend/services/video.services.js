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

export const getUploadedVideos = async () => {
  const { data, error } = await supabase
    .from("videos")
    .select(`
      id,
      original_name,
      storage_path,
      title,
      description,
      mime_type,
      file_size,
      duration_seconds,
      width,
      height,
      sprite_path,
      sprite_status,
      created_at
    `)
    .eq("status", "UPLOADED")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

export const getVideoForPlayback = async (videoId) => {
  const { data: video, error } = await supabase
    .from("videos")
    .select(`
      id,
      original_name,
      storage_path,
      title,
      description,
      mime_type,
      file_size,
      duration_seconds,
      width,
      height
    `)
    .eq("id", videoId)
    .eq("status", "UPLOADED")
    .single();

  if (error) {
    throw error;
  }

  const { data: signedUrlData, error: signedUrlError } =
    await supabase.storage
      .from("videos")
      .createSignedUrl(video.storage_path, 3600);

  if (signedUrlError) {
    throw signedUrlError;
  }

  return {
    ...video,
    playbackUrl: signedUrlData.signedUrl,
  };
};