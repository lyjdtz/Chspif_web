import React, { useEffect, useRef, useState } from 'react';

interface BackgroundMusicProps {
  audioUrl: string;
  volume?: number;
  autoPlay?: boolean;
  loop?: boolean;
  delayPlay?: number; // Delay in milliseconds before playing
}

// Storage key for music playing state
const MUSIC_PLAYED_KEY = 'background-music-played';

/**
 * Background music player component - no UI, just functionality
 * @param audioUrl - URL of the audio file
 * @param volume - Initial volume (0-1), default is 0.3
 * @param autoPlay - Whether to auto play on mount, default is true
 * @param loop - Whether to loop the audio, default is true
 * @param delayPlay - Delay in milliseconds before playing, default is 500
 * @constructor BackgroundMusic - React Function Component
 */
const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ 
  audioUrl, 
  volume = 0.3, 
  autoPlay = true,
  loop = true,
  delayPlay = 500 // Reduced delay to start playing sooner
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false); // Track if music has started
  const [playAttempts, setPlayAttempts] = useState(0); // Track number of play attempts
  
  // Maximum number of auto-play attempts
  const MAX_PLAY_ATTEMPTS = 3;
  // Interval between play attempts in milliseconds
  const PLAY_ATTEMPT_INTERVAL = 1000;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log('Background music component initialized');
    console.log('AutoPlay enabled:', autoPlay);
    console.log('Audio URL:', audioUrl);
    
    // Set initial volume
    audio.volume = volume;
    
    // Set loop
    audio.loop = loop;
    
    // Check if music was played before (persistent across page refreshes)
    const wasMusicPlayedBefore = localStorage.getItem(MUSIC_PLAYED_KEY) === 'true';
    console.log('Was music played before:', wasMusicPlayedBefore);
    
    // Keep track of attempts locally to avoid dependency issues
    let localPlayAttempts = 0;
    let eventListenersAdded = false;
    let retryTimeout: NodeJS.Timeout | null = null;
    
    // Fallback to play on user interaction if auto-play fails after all attempts
    const setupUserInteractionFallback = () => {
      if (eventListenersAdded) return; // Avoid adding multiple times
      
      console.log('Setting up user interaction fallback');
      
      const handleUserInteraction = () => {
        if (!hasStartedPlaying) {
          console.log('User interaction detected, trying to play music');
          setHasStartedPlaying(true);
          localStorage.setItem(MUSIC_PLAYED_KEY, 'true'); // Save state to localStorage
          audio.play().catch(error => {
            console.log('Background music play on interaction failed:', error);
          });
        }
      };

      // Add event listeners for user interaction
      window.addEventListener('click', handleUserInteraction);
      window.addEventListener('keydown', handleUserInteraction);
      window.addEventListener('touchstart', handleUserInteraction);
      window.addEventListener('scroll', handleUserInteraction);
      window.addEventListener('mousemove', handleUserInteraction); // Add mouse move event for more chances
      window.addEventListener('mouseover', handleUserInteraction); // Add mouseover event
      window.addEventListener('wheel', handleUserInteraction); // Add wheel event
      window.addEventListener('focus', handleUserInteraction); // Add focus event
      
      eventListenersAdded = true;
      
      return () => {
        // Remove event listeners when component unmounts
        window.removeEventListener('click', handleUserInteraction);
        window.removeEventListener('keydown', handleUserInteraction);
        window.removeEventListener('touchstart', handleUserInteraction);
        window.removeEventListener('scroll', handleUserInteraction);
        window.removeEventListener('mousemove', handleUserInteraction);
        window.removeEventListener('mouseover', handleUserInteraction);
        window.removeEventListener('wheel', handleUserInteraction);
        window.removeEventListener('focus', handleUserInteraction);
      };
    };
    
    // Try to play music with multiple attempts
    const tryPlayMusic = () => {
      if (localPlayAttempts >= MAX_PLAY_ATTEMPTS) {
        console.log('Max play attempts reached, setting up user interaction fallback');
        setupUserInteractionFallback();
        return;
      }
      
      localPlayAttempts++;
      console.log('Attempting to play music (attempt', localPlayAttempts, '/', MAX_PLAY_ATTEMPTS, ')');
      
      audio.play()
        .then(() => {
          console.log('Background music started playing successfully!');
          setHasStartedPlaying(true);
          localStorage.setItem(MUSIC_PLAYED_KEY, 'true'); // Save state to localStorage
          if (retryTimeout) {
            clearTimeout(retryTimeout);
            retryTimeout = null;
          }
        })
        .catch(error => {
          console.log('Background music play attempt failed:', error.message);
          
          // Try again after a delay
          retryTimeout = setTimeout(tryPlayMusic, PLAY_ATTEMPT_INTERVAL);
        });
    };
    
    // Force user interaction detection on component mount
    const forceUserInteractionCheck = () => {
      console.log('Forcing user interaction check');
      setupUserInteractionFallback();
    };

    // Start playing logic
    if (autoPlay) {
      // Always try to play immediately on component mount
      // This covers both first-time visitors and returning visitors
      const initialPlayTimeout = setTimeout(tryPlayMusic, delayPlay);
      
      // Also setup the fallback immediately in case auto-play fails
      // This ensures the music will play on any user interaction
      setTimeout(setupUserInteractionFallback, 100);
      
      return () => {
        if (initialPlayTimeout) clearTimeout(initialPlayTimeout);
        if (retryTimeout) clearTimeout(retryTimeout);
      };
    }
  }, [audioUrl, volume, autoPlay, loop, delayPlay, hasStartedPlaying]);

  // Only render if audioUrl is provided
  if (!audioUrl) return null;

  return (
    // Audio element configuration optimized for auto-play
    <audio 
      ref={audioRef} 
      src={audioUrl} 
      preload="auto" 
      crossOrigin="anonymous"
      muted={false} // Keep audio audible
      autoPlay={autoPlay} // Add autoPlay attribute
      loop={loop} // Add loop attribute
      style={{ display: 'none' }}
    />
  );
};

export default BackgroundMusic;