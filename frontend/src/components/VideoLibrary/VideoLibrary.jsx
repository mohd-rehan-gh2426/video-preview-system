import React, { useEffect, useState } from "react";
import { getUploadedVideos } from "../../api/video.api";
import { useNavigate } from "react-router-dom";
import "./VideoLibrary.css";



const VideoLibrary = () => {

  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getUploadedVideos();

        setVideos(data.videos);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (isLoading) {
    return <p>Loading videos...</p>;
  }

  if (videos.length === 0) {
    return <p>No uploaded videos yet.</p>;
  }

  return (
    <div className="video-library">
      <h1>My Videos</h1>

      <div className="video-list">
        {videos.map((video) => (
          <div className="video-card" key={video.id}>
            <h3>{video.original_name}</h3>

            <p>{video.mime_type}</p>

            <p>
              {(video.file_size / (1024 * 1024)).toFixed(2)} MB
            </p>

            <button onClick={() => navigate(`/videos/${video.id}`)}>
              Play
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoLibrary;