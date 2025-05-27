import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';

interface VideoPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  poster?: string;
  aspectRatio?: 'square' | '16:9' | '9:16' | '4:3' | '21:9' | 'portrait' | 'auto' | '4:6';
  autoGeneratePoster?: boolean;
  showControls?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill';
  initialMuted?: boolean;
}

/**
 * Universal video player component designed to work with all video formats
 * including Cloudinary videos
 */
export function VideoPlayer({
  src,
  poster,
  aspectRatio = '16:9',
  className,
  autoGeneratePoster = true,
  showControls = true,
  objectFit = 'cover',
  initialMuted = false,
  ...props
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [error, setError] = useState<string | null>(null);
  const [currentPoster, setCurrentPoster] = useState<string | undefined>(poster);
  
  const aspectRatioClasses = {
    'square': 'aspect-square',
    '16:9': 'aspect-video',
    '9:16': 'aspect-[9/16]',
    '4:6': 'aspect-[4/6]',
    'portrait': 'aspect-[9/16]',
    '4:3': 'aspect-4/3',
    '21:9': 'aspect-21/9',
    'auto': '',
  };
  
  // Generate a thumbnail URL for Cloudinary videos if needed
  useEffect(() => {
    // Only generate if no poster is provided and autoGeneratePoster is true
    if (!poster && autoGeneratePoster && src && src.includes('cloudinary.com')) {
      try {
        // Check if it's a Cloudinary video URL
        const isCloudinaryVideo = 
          src.includes('/video/upload/') || 
          src.includes('resource_type=video');
          
        if (isCloudinaryVideo) {
          // Format: https://res.cloudinary.com/cloud_name/video/upload/v1234/file.mp4
          // To:     https://res.cloudinary.com/cloud_name/video/upload/c_fill,h_600,w_800,q_auto,so_0/v1234/file.jpg
          let thumbnailUrl;
          
          if (src.includes('/video/upload/')) {
            const parts = src.split('/upload/');
            if (parts.length === 2) {
              thumbnailUrl = `${parts[0]}/upload/c_fill,h_600,w_800,q_auto,so_0/${parts[1].replace(/\.(mp4|mov|webm|avi)$/i, '.jpg')}`;
              setCurrentPoster(thumbnailUrl);
            }
          }
        }
      } catch (error) {
        console.error('Error generating video thumbnail:', error);
      }
    }
  }, [src, poster, autoGeneratePoster]);
  
  // Toggle play/pause with iOS-specific handling
  const togglePlay = async () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      return;
    }
    
    try {
      // For iOS, we need to ensure video is fully loaded
      if (videoRef.current.readyState === 0) {
        // Video hasn't started loading yet, force a load
        videoRef.current.load();
        setIsLoading(true);
        
        // Wait for metadata to load with proper cleanup
        await new Promise<void>((resolve) => {
          if (!videoRef.current) {
            resolve();
            return;
          }
          
          const handleLoadedMetadata = () => {
            videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
            resolve();
          };
          
          videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
          
          // Safety timeout in case the event never fires
          const timeoutId = setTimeout(() => {
            videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
            resolve();
          }, 5000);
          
          // Cleanup function
          return () => {
            clearTimeout(timeoutId);
            videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
          };
        });
      }
      
      // Set playback rate directly
      if (videoRef.current && typeof videoRef.current.playbackRate === 'number') {
        videoRef.current.playbackRate = 1.0;
      }
      
      // Set this immediately for a more responsive feel
      setIsPlaying(true);
      
      // Always try muted playback first on mobile devices (especially for iOS)
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isIOS) {
        // For iOS specifically (major focus)
        if (!videoRef.current) return;
        
        // iOS needs videos to be muted first
        videoRef.current.muted = true;
        setIsMuted(true);
        
        try {
          // Try to play the video (muted)
          await videoRef.current.play();
          console.log("iOS video playing muted");
          
          // Special iOS handling - show unmute message
          setError('Tap the unmute button to hear sound');
          setTimeout(() => setError(null), 3000);
        } catch (err) {
          console.error('iOS video play failed:', err);
          setError('Unable to play video. Try tapping again.');
          setIsPlaying(false);
        }
      } else if (isMobile) {
        // For other mobile devices
        if (!videoRef.current) return;
        
        // Start muted on mobile for better autoplay
        videoRef.current.muted = true;
        setIsMuted(true);
        
        try {
          await videoRef.current.play();
          console.log("Mobile video playing muted");
        } catch (err) {
          console.error('Mobile video play failed:', err);
          setError('Tap again to play video');
          setIsPlaying(false);
        }
      } else {
        // Desktop browsers - try with sound first
        if (!videoRef.current) return;
        
        try {
          await videoRef.current.play();
          console.log("Desktop video playing with sound");
        } catch (err: any) {
          console.error('Error playing video with sound:', err);
          
          // If it's an autoplay restriction, try muted playback
          if (err.name === 'NotAllowedError' && videoRef.current) {
            console.log("Autoplay blocked - trying muted playback");
            
            // Try playing muted
            videoRef.current.muted = true;
            setIsMuted(true);
            
            try {
              await videoRef.current.play();
              console.log("Video playing muted after autoplay restriction");
              
              // Show unmute button info
              setError('Tap the unmute button to hear sound');
              setTimeout(() => setError(null), 3000);
            } catch (mutedErr) {
              console.error('Even muted playback failed:', mutedErr);
              setError('This browser is blocking video playback. Tap again to try.');
              setIsPlaying(false);
            }
          } else {
            setError(`Error playing video. Tap again to retry.`);
            setIsPlaying(false);
          }
        }
      }
    } catch (err) {
      console.error('General error playing video:', err);
      setError(`Playback error. Please try again.`);
      setIsPlaying(false);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  
  // Handle load start
  const handleLoadStart = () => {
    setIsLoading(true);
    setError(null);
  };
  
  // Handle can play
  const handleCanPlay = () => {
    setIsLoading(false);
  };
  
  // Handle error
  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error('Video error:', e);
    setIsLoading(false);
    
    // Try to get more specific error information
    const target = e.currentTarget as HTMLVideoElement;
    const errorCode = target.error?.code || 0;
    
    let errorMessage = 'Error loading video.';
    switch (errorCode) {
      case 1: 
        errorMessage = 'Video loading aborted.';
        break;
      case 2:
        errorMessage = 'Network error while loading video.';
        break;
      case 3:
        errorMessage = 'Video decoding failed.';
        break;
      case 4:
        errorMessage = 'Video format not supported.';
        break;
      default:
        errorMessage = `Error loading video (code: ${errorCode}).`;
    }
    
    setError(errorMessage);
  };
  
  // Component cleanup
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);
  
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-background rounded-md',
        aspectRatioClasses[aspectRatio],
        className
      )}
      {...props}
    >
      {/* Video element with iOS compatibility attributes */}
      <video
        ref={videoRef}
        src={src}
        poster={currentPoster}
        className={`w-full h-full object-${objectFit}`}
        playsInline
        // @ts-ignore - These attributes help with iOS playback
        webkit-playsinline="true"
        x5-playsinline="true"
        preload="auto"
        autoPlay={false}
        loop={false}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
        onEnded={() => setIsPlaying(false)}
        muted={isMuted}
        // The playbackRate needs to be applied manually, not as an attribute
        controls={showControls && isPlaying}
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/quicktime" />
        <source src={src} type="video/webm" />
        Your browser does not support HTML video.
      </video>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      )}
      
      {/* Play overlay (visible when paused) */}
      {!isPlaying && !isLoading && !error && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 z-10 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="p-4 bg-white/20 rounded-full">
            <Play className="h-8 w-8 text-white" fill="white" />
          </div>
          <p className="text-white font-medium mt-2">Play Video</p>
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20 p-4">
          <AlertTriangle className="h-10 w-10 text-red-500 mb-2" />
          <p className="text-white text-center mb-4 max-w-xs">{error}</p>
          <div className="flex gap-2 flex-wrap justify-center">
            <Button 
              size="sm"
              onClick={togglePlay}
              className="bg-primary-foreground text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Try Again
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.open(src, '_blank')}
              className="bg-transparent text-white border-white hover:bg-white/20"
            >
              Open in New Tab
            </Button>
          </div>
        </div>
      )}
      
      {/* Video badge */}
      <Badge className="absolute top-2 right-2 bg-black/60 text-white z-10">
        Video
      </Badge>
      
      {/* Unmute button - shows when video is playing with muted audio */}
      {isPlaying && isMuted && (
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-12 right-2 z-20 bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse"
          onClick={toggleMute}
        >
          <VolumeX className="h-4 w-4 mr-1" />
          Unmute
        </Button>
      )}
      
      {/* Controls overlay (only if showControls is false and video is playing) */}
      {!showControls && isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center bg-gradient-to-t from-black/70 to-transparent z-10">
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-white hover:bg-white/20"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-white hover:bg-white/20"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4 mr-1" /> : <Volume2 className="h-4 w-4 mr-1" />}
            {isMuted ? 'Unmute' : 'Mute'}
          </Button>
        </div>
      )}
    </div>
  );
}