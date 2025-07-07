import React, { useState, useEffect } from 'react';

export const SpaceBackground: React.FC = () => {
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    // Try to preload the video to check if it exists
    const video = document.createElement('video');
    video.src = '/Video_Lunar_Descripción_y_Creación.mp4';
    
    video.addEventListener('loadeddata', () => {
      console.log('Video loaded successfully');
      setIsVideoLoaded(true);
    });
    
    video.addEventListener('error', (e) => {
      console.error('Video failed to load:', e);
      setVideoError(true);
    });

    // Try to load the video
    video.load();
  }, []);

  const handleVideoError = () => {
    console.error('Video playback error, falling back to image');
    setVideoError(true);
  };

  const handleVideoLoad = () => {
    console.log('Video element loaded and ready');
    setIsVideoLoaded(true);
  };

  return (
    <div className="fixed inset-0 z-0">
      {!videoError ? (
        <>
          {/* Background video */}
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            onError={handleVideoError}
            onLoadedData={handleVideoLoad}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              minWidth: '100%',
              minHeight: '100%'
            }}
          >
            <source src="/Video_Lunar_Descripción_y_Creación.mp4" type="video/mp4" />
          </video>
          
          {/* Loading indicator while video loads */}
          {!isVideoLoaded && (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="text-white">Cargando video...</div>
            </div>
          )}
        </>
      ) : (
        /* Fallback to image if video fails */
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/image copy.png")'
          }}
        />
      )}
      
      {/* Overlay to enhance glass effects and ensure text readability */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
    </div>
  );
};