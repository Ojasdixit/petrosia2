import { useState, useRef, useEffect } from 'react';
import { Play, Loader2 } from 'lucide-react';

interface DirectVideoPlayerProps {
  videoUrl: string;
  className?: string;
}

/**
 * This is a simplified direct video player for Cloudinary URLs
 * that works specifically with the format provided
 */
const DirectVideoPlayer = ({ videoUrl, className = '' }: DirectVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Try to create a poster image from the video URL
  const getPosterUrl = (url: string): string => {
    try {
      // Try to convert a video URL to a poster image URL
      // Format: https://res.cloudinary.com/djxv1usyv/video/upload/v1744871783/IMG_7615_hbvvw0.mp4
      // To:     https://res.cloudinary.com/djxv1usyv/video/upload/c_fill,h_600,w_600,q_auto,so_0/v1744871783/IMG_7615_hbvvw0.jpg
      return url.replace(/\/upload\//, '/upload/c_fill,h_600,w_600,q_auto,so_0/').replace(/\.mp4$/, '.jpg');
    } catch (e) {
      console.error("Error creating poster URL:", e);
      return '';
    }
  };

  const posterUrl = getPosterUrl(videoUrl);
  
  // Handle video play
  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error playing video:", err);
          setError("Failed to play video. Try opening in a new tab.");
          setIsLoading(false);
        });
    }
  };

  // Handle load events
  const handleLoadStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error("Video error:", e);
    setError("Video could not be loaded");
    setIsLoading(false);
  };

  return (
    <div className={`relative overflow-hidden rounded ${className}`}>
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 cursor-pointer" 
          onClick={playVideo}
        >
          {isLoading ? (
            <Loader2 className="h-12 w-12 text-white animate-spin" />
          ) : (
            <>
              <div className="p-4 rounded-full bg-white/30 mb-2">
                <Play className="h-8 w-8 text-white" fill="white" />
              </div>
              <p className="text-white text-sm font-medium">Play Video</p>
            </>
          )}
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20">
          <p className="text-white text-center px-4">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-white/20 text-white rounded hover:bg-white/30"
            onClick={() => window.open(videoUrl, '_blank')}
          >
            Open in new tab
          </button>
        </div>
      )}

      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        poster={posterUrl}
        controls={isPlaying}
        playsInline
        preload="metadata"
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
        muted
      >
        Your browser does not support video playback.
      </video>
    </div>
  );
};

export default DirectVideoPlayer;