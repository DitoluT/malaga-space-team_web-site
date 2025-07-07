import React from 'react';

export const SpaceBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0">
      {/* Background video */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          minWidth: '100%',
          minHeight: '100%'
        }}
      >
        <source src="/Video_Lunar_Descripción_y_Creacion.mp4" type="video/mp4" />
        {/* Fallback to image if video fails to load */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/image copy.png")'
          }}
        />
      </video>
      
      {/* Subtle overlay to enhance glass effects and ensure text readability */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
    </div>
  );
};