import { generateUploadUrl } from "../services/storage.services.js";
import { completeVideoUpload } from "../services/video.services.js";


export const getSignedUploadUrl = async (req,res)=>{
  try {
  console.log("🔥 POST /video/upload-url HIT");
    const {fileName}=req.body;

    if(!fileName){
      return res.status(400).json({
        message:"fileName required"
      });
    }


    const uploadData =
      await generateUploadUrl(fileName);


    res.status(200).json(uploadData);


  } catch(error){
    console.error(error)
    res.status(500).json({
      message:error.message
    });

  }
}

export const completeUpload = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { mimeType, fileSize } = req.body;

    if (!videoId) {
      return res.status(400).json({
        message: "videoId is required",
      });
    }

    const video = await completeVideoUpload(
      videoId,
      mimeType,
      fileSize
    );

    return res.status(200).json({
      message: "Video upload completed successfully",
      video,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};