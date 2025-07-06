import React from 'react';
import { GlassContainer } from './GlassContainer';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.FormEvent) => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
}

export const GlassButton: React.FC<GlassButtonProps> = ({ 
  children, 
  onClick, 
  className = "", 
  variant = 'primary',
  size = 'md',
  type = 'button'
}) => {
  const variantStyles = {
    primary: 'from-blue-500/30 to-blue-600/30 border-blue-400/50 hover:from-blue-400/40 hover:to-blue-500/40',
    secondary: 'from-green-500/30 to-green-600/30 border-green-400/50 hover:from-green-400/40 hover:to-green-500/40',
    accent: 'from-purple-500/30 to-purple-600/30 border-purple-400/50 hover:from-purple-400/40 hover:to-purple-500/40'
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <GlassContainer className={`glass-button-container ${className}`}>
      <button 
        type={type}
        onClick={onClick}
        className={`
          relative w-full rounded-full font-bold text-white
          bg-gradient-to-r ${variantStyles[variant]}
          border border-solid transition-all duration-300
          hover:scale-105 hover:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-white/20
          cursor-pointer
          ${sizeStyles[size]}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full hover:translate-x-full transition-transform duration-700 rounded-full"></div>
        <span className="relative z-10 drop-shadow-lg">{children}</span>
      </button>
    </GlassContainer>
  );
};