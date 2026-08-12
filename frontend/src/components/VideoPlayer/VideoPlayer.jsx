import React from "react";
import "./VideoPlayer.css";

const VideoPlayer = ({ videoUrl }) => {
  return (
    <div className="video-player">
      <video
        className="video-player-element"
        src={videoUrl}
        controls
      />
    </div>
  );
};

export default VideoPlayer;