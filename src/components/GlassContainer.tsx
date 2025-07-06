import React from 'react';

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`GlassContainer ${className}`} style={{ pointerEvents: 'none' }}>
      <div className="GlassMaterial">
        <div className="GlassEdgeReflection">
          <div className="GlassRefraction">
            <div className="GlassBlur"></div>
          </div>
        </div>
      </div>
      <div className="GlassContent" style={{ pointerEvents: 'auto' }}>
        {children}
      </div>
    </div>
  );
};