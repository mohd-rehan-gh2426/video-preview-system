import React, { useState } from "react";
import { getSignedUploadUrl,uploadVideoToSupabase } from "../../api/video.api";

const UploadVideo = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

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

    // Step 1: Get signed URL
    const uploadData = await getSignedUploadUrl(
      selectedVideo.name
    );

    console.log("Signed URL received:", uploadData);


    // Step 2: Upload directly to Supabase
    await uploadVideoToSupabase(
      uploadData.signedUrl,
      selectedVideo
    );


    console.log("Upload completed successfully");

  } catch (error) {
    console.log(error);
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
      <button onClick={handleClick}>Upload</button>
    </div>
  );
};

export default UploadVideo;
