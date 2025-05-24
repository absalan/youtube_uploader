
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Tailwind color class e.g. border-blue-500
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'border-primary-600', className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 ${sizeClasses[size]} ${color} ${className}`}></div>
  );
};

export default Spinner;
