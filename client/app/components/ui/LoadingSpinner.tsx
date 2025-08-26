import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-4 border-teal-500 border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
} 