import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import { getVideoById } from "../../api/video.api";
import "./Watch.css";

const Watch = () => {
  const { videoId } = useParams();

  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);

        const data = await getVideoById(videoId);

        setVideo(data.video);
      } catch (error) {
        console.error("Failed to fetch video:", error);

        setError("Unable to load video.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (isLoading) {
    return (
      <main className="watch-page">
        <div className="watch-container">
          <p>Loading video...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="watch-page">
        <div className="watch-container">
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="watch-page">
      <div className="watch-container">
        <VideoPlayer videoUrl={video.playbackUrl} />

        <div className="watch-info">
          <h1>{video.title || video.original_name}</h1>
        </div>
      </div>
    </main>
  );
};

export default Watch;