import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Video, Volume2, VolumeX, Play, Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  posterUrl?: string;
  title?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

const VideoPlayer = ({ 
  src, 
  posterUrl, 
  title,
  width = '100%',
  height = '400px',
  className = ''
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Generate thumbnail URL from video URL
  const generateThumbnail = (videoUrl: string): string => {
    if (!videoUrl || !videoUrl.includes('cloudinary.com')) {
      return '/video-thumbnail.jpg';
    }
    
    try {
      const urlParts = videoUrl.split('/upload/');
      if (urlParts.length !== 2) return '/video-thumbnail.jpg';
      
      return `${urlParts[0]}/upload/c_fill,h_600,w_800,q_80,so_0/${urlParts[1].replace(/\.(mp4|mov|webm|avi)$/i, '.jpg')}`;
    } catch (error) {
      console.error('Error generating video thumbnail:', error);
      return '/video-thumbnail.jpg';
    }
  };
  
  const defaultPoster = posterUrl || generateThumbnail(src);
  
  // Reset video and player state
  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // Attempt to play and handle any autoplay restrictions
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Video playback started successfully');
            })
            .catch(err => {
              console.error('Error playing video:', err);
              setError('Playback failed. Try using the player controls.');
            });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  
  // Handle video loading
  const handleLoadStart = () => {
    setIsLoading(true);
    setError(null);
  };
  
  // Handle successful loading
  const handleCanPlay = () => {
    setIsLoading(false);
    setError(null);
  };
  
  // Handle video errors
  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video playback error:', e);
    setIsLoading(false);
    setError('Failed to load video. Please try again later.');
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);
  
  // Special handling for the problematic URL
  const isSpecificProblematicUrl = src === "https://res.cloudinary.com/djxv1usyv/video/upload/v1744871783/IMG_7615_hbvvw0.mp4";
  
  return (
    <div 
      className={`relative w-full h-full bg-black rounded overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Video badge */}
      <div className="absolute top-2 right-2 z-10">
        <Badge className="bg-black/60 text-white">
          <Video className="h-3 w-3 mr-1" /> Video
        </Badge>
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
          <div className="p-3 rounded-full bg-red-500/20 mb-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4m0 4h.01"></path>
              <path d="M5.07 19H19a2 2 0 0 0 1.75-2.96L13.75 4a2 2 0 0 0-3.5 0L3.25 16.04a2 2 0 0 0 1.75 2.96Z"></path>
            </svg>
          </div>
          <p className="text-white font-medium">{error}</p>
          <button 
            className="mt-3 px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
            onClick={() => window.open(src, '_blank')}
          >
            Open in new tab
          </button>
        </div>
      )}
      
      {/* Play overlay for paused state */}
      {!isLoading && !isPlaying && !error && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 cursor-pointer"
          onClick={togglePlay}
        >
          {title && (
            <div className="absolute top-10 left-4 right-4">
              <p className="text-white font-medium truncate">
                {title}
              </p>
            </div>
          )}
          <div className="p-4 rounded-full bg-white/30 mb-2">
            <Play className="h-8 w-8 text-white" fill="white" />
          </div>
          <p className="text-white text-sm font-medium">Click to Play</p>
        </div>
      )}
      
      {/* Video element */}
      <video 
        ref={videoRef}
        src={src}
        poster={defaultPoster}
        controls
        controlsList="nodownload"
        playsInline
        preload="metadata"
        className="w-full h-full object-contain"
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
        onEnded={resetVideo}
        muted={isMuted}
      >
        Your browser does not support the video tag.
      </video>
      
      {/* Custom controls */}
      <div className="absolute bottom-2 right-2 z-20 flex space-x-2">
        <button 
          className="p-2 rounded-full bg-black/70 text-white hover:bg-black/80 transition-colors"
          onClick={toggleMute}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;