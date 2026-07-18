import { generateUploadUrl } from "../services/storage.services.js";

export const getSignedUploadUrl = async (req,res)=>{
  try {

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