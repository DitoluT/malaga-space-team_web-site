import React from 'react';

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`GlassContainer ${className}`}>
      <div className="GlassContent">
        {children}
      </div>
    </div>
  );
};