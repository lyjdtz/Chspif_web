import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const BackgroundContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const VideoPlaceholder = styled.img<{ $isVideoReady: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 1s ease-out;
  opacity: ${({ $isVideoReady }) => ($isVideoReady ? 0 : 1)};
  z-index: -1;
`;

const BackgroundVideo = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(150vh * 16 / 9);
  height: 100vh;
  min-width: 100vw;
  min-height: calc(120vw * 9 / 16);
  transform: translate(-50%, -50%);
  z-index: -1;
  overflow: hidden;

  iframe, video {
    width: 100%;
    height: 100%;
    border: 0;
    object-fit: cover;
  }
`;

interface HeaderVideoProps {
  bvid?: string;
  videoUrl?: string;
  posterUrl?: string;
  start?: number;
  duration?: number;
}

/**
 * Header video component, responsive background video with placeholder
 * @param bvid - Bilibili video ID (BV number) - use this or videoUrl
 * @param videoUrl - Direct video file URL (for self-hosted videos) - use this or bvid
 * @param posterUrl - Poster image URL
 * @param start - Start time of the video in seconds
 * @param duration - Estimated video duration in seconds (only for Bilibili)
 * @constructor HeaderVideo - React Function Component
 */
const HeaderVideo: React.FC<HeaderVideoProps> = ({ 
  bvid, 
  videoUrl, 
  posterUrl = '', 
  start = 0, 
  duration = 60 // Default to 60 seconds for Bilibili
}) => {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isPrerendering = /bot|crawl|spider|googlebot/i.test(
    navigator.userAgent,
  );

  // Determine which video source to use
  const useSelfHostedVideo = !!videoUrl;

  // Bilibili iframe URL with autoplay and mute parameters
  const bilibiliIframeUrl = bvid ? `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&autoplay=1&muted=1&danmaku=0&controls=0&high_quality=1&width=100%25&height=100%25&t=${start}` : '';

  useEffect(() => {
    if (useSelfHostedVideo) {
      // Handle self-hosted video
      const video = videoRef.current;
      if (video) {
        // Set video ready when data is loaded
        const handleLoadedData = () => {
          setIsVideoReady(true);
        };

        // Set video to start at the specified time
        video.currentTime = start;
        video.addEventListener('loadeddata', handleLoadedData);

        return () => {
          video.removeEventListener('loadeddata', handleLoadedData);
        };
      }
    } else {
      // Handle Bilibili video
      // Set video ready after iframe loads
      const handleIframeLoad = () => {
        setIsVideoReady(true);
      };

      // Simple and reliable loop implementation for Bilibili
      const loopInterval = setInterval(() => {
        console.log('Restarting Bilibili video...');
        setIsVideoReady(false);
        setIframeKey(prev => prev + 1);
      }, (duration - start) * 1000);

      return () => {
        clearInterval(loopInterval);
      };
    }
  }, [bvid, videoUrl, start, duration, iframeKey, useSelfHostedVideo]);

  return (
    <BackgroundContainer>
      {/* Show placeholder if URL is provided and video is not ready */}
      {posterUrl && !isVideoReady && !isPrerendering && (
        <VideoPlaceholder
          src={posterUrl}
          alt='Background video placeholder'
          $isVideoReady={isVideoReady}
        />
      )}
      {!isPrerendering && (
        <BackgroundVideo key={iframeKey}>
          {useSelfHostedVideo ? (
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              poster={posterUrl}
            ></video>
          ) : bvid ? (
            <iframe
              src={bilibiliIframeUrl}
              title='Bilibili background video'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            ></iframe>
          ) : null}
        </BackgroundVideo>
      )}
    </BackgroundContainer>
  );
};

export default HeaderVideo;
