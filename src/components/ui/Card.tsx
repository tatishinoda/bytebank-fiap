'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark';
}

const Card = ({ children, className, variant = 'default' }: CardProps) => {
  const baseClasses = 'rounded-lg shadow-md p-6';
  
  const variantClasses = {
    default: 'bg-white text-gray-800',
    dark: 'bg-[#004D61] text-white'
  };
  
  return (
    <div className={twMerge(baseClasses, variantClasses[variant], className)}>
      {children}
    </div>
  );
};

export default Card;
