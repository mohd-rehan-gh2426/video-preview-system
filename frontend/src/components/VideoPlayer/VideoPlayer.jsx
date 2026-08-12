
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./VideoPlayer.css";

/** Format seconds as 0:00, 1:05 or 1:01:10 for videos over an hour. */
const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

const clamp01 = (value) => Math.min(1, Math.max(0, value));

const VideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const timelineRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isTimelineHovered, setIsTimelineHovered] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [hoverPosition, setHoverPosition] = useState(0); // 0..1 along the track

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleVideoClick = () => {
    togglePlay();
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  /* ---- Video element -> React state ---- */

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(Number.isFinite(video.duration) ? video.duration : 0);
    setCurrentTime(video.currentTime);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || isScrubbing) return;
    setCurrentTime(video.currentTime);
  };

  const handleProgress = () => {
    const video = videoRef.current;
    if (!video || !video.buffered || video.buffered.length === 0) return;
    // Keep it simple: use the end of the range containing the playhead.
    let end = 0;
    for (let i = 0; i < video.buffered.length; i += 1) {
      if (video.buffered.start(i) <= video.currentTime) {
        end = Math.max(end, video.buffered.end(i));
      }
    }
    setBuffered(end);
  };

  /* ---- Timeline coordinate helpers (reusable for sprite previews later) ---- */

  const ratioFromClientX = useCallback((clientX) => {
    const track = timelineRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    if (rect.width === 0) return 0;
    return clamp01((clientX - rect.left) / rect.width);
  }, []);

  const seekToRatio = useCallback(
    (ratio) => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration)) return;
      const newTime = ratio * video.duration;
      video.currentTime = newTime;
      setCurrentTime(newTime);
    },
    []
  );

  const updateHoverFromClientX = useCallback(
    (clientX) => {
      const ratio = ratioFromClientX(clientX);
      setHoverPosition(ratio);
      setHoverTime(ratio * (duration || 0));
    },
    [duration, ratioFromClientX]
  );

  const handlePointerDown = (event) => {
    const track = timelineRef.current;
    if (!track) return;
    track.setPointerCapture?.(event.pointerId);
    setIsScrubbing(true);
    const ratio = ratioFromClientX(event.clientX);
    updateHoverFromClientX(event.clientX);
    seekToRatio(ratio);
  };

  const handlePointerMove = (event) => {
    updateHoverFromClientX(event.clientX);
    if (isScrubbing) {
      seekToRatio(ratioFromClientX(event.clientX));
    }
  };

  const handlePointerUp = (event) => {
    if (!isScrubbing) return;
    timelineRef.current?.releasePointerCapture?.(event.pointerId);
    setIsScrubbing(false);
  };

  const handleKeyDown = (event) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    const step = event.shiftKey ? 10 : 5;
    let next = null;

    if (event.key === "ArrowRight") next = video.currentTime + step;
    else if (event.key === "ArrowLeft") next = video.currentTime - step;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = video.duration;
    else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      togglePlay();
      return;
    }

    if (next !== null) {
      event.preventDefault();
      const clamped = Math.min(video.duration, Math.max(0, next));
      video.currentTime = clamped;
      setCurrentTime(clamped);
    }
  };

  /* Keep React in sync with the real element state (autoplay, external pause…). */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const progressRatio = duration > 0 ? clamp01(currentTime / duration) : 0;
  const bufferedRatio = duration > 0 ? clamp01(buffered / duration) : 0;
  const progressPercent = progressRatio * 100;
  const bufferedPercent = bufferedRatio * 100;
  const showTooltip = isTimelineHovered || isScrubbing;

  return (
    <div className="video-player">
      <div className="video-player-screen">
        <video
          ref={videoRef}
          className="video-player-element"
          src={videoUrl}
          onClick={handleVideoClick}
          onEnded={handleVideoEnded}
          onLoadedMetadata={handleLoadedMetadata}
          onDurationChange={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onProgress={handleProgress}
          playsInline
        />
      </div>

      <div className="video-player-controls">
        {/* Timeline row — sits above the button row, like modern players. */}
        <div className="video-player-timeline-row">
          <div
            ref={timelineRef}
            className={`video-player-timeline${isScrubbing ? " is-scrubbing" : ""}`}
            role="slider"
            tabIndex={0}
            aria-label="Seek video"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration) || 0}
            aria-valuenow={Math.floor(currentTime) || 0}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerEnter={() => setIsTimelineHovered(true)}
            onPointerLeave={() => setIsTimelineHovered(false)}
            onKeyDown={handleKeyDown}
          >
            <div className="video-player-track">
              <div
                className="video-player-track-buffered"
                style={{ width: `${bufferedPercent}%` }}
              />
              <div
                className="video-player-track-progress"
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className="video-player-playhead"
                style={{ left: `${progressPercent}%` }}
              />
            </div>

            {/* Hover preview. Sprite-sheet frame will be added inside later. */}
            <div
              className={`video-player-hover-preview${showTooltip ? " is-visible" : ""}`}
              style={{ left: `${hoverPosition * 100}%` }}
              aria-hidden="true"
            >
              <span className="video-player-hover-time">{formatTime(hoverTime)}</span>
            </div>
          </div>
        </div>

        {/* Button row. */}
        <div className="video-player-buttons-row">
          <div className="video-player-controls-left">
            <button
              type="button"
              className="video-player-play-button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              aria-pressed={isPlaying}
            >
              <span className="video-player-play-icon" aria-hidden="true">
                {isPlaying ? "❚❚" : "▶"}
              </span>
            </button>

            <span className="video-player-time" aria-live="off">
              <span className="video-player-time-current">{formatTime(currentTime)}</span>
              <span className="video-player-time-separator"> / </span>
              <span className="video-player-time-duration">{formatTime(duration)}</span>
            </span>
          </div>

          {/* Reserved for volume, settings, fullscreen. */}
          <div className="video-player-controls-right" />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;