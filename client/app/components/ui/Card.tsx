import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export default function Card({ 
  children, 
  className = '', 
  hover = true,
  shadow = 'lg'
}: CardProps) {
  const baseClasses = 'bg-white rounded-2xl overflow-hidden border border-gray-100';
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };
  const hoverClasses = hover ? 'hover:shadow-xl transition-shadow duration-300' : '';
  
  const cardClasses = `${baseClasses} ${shadowClasses[shadow]} ${hoverClasses} ${className}`;
  
  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
} 