import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isFullWidth?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  className,
  ...props
}: ButtonProps) => {
  const baseClasses = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#004D61] to-[#006778] text-white hover:from-[#00586E] hover:to-[#007A8F] focus:ring-[#004D61]/50 rounded-lg',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400/50 rounded-lg',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 focus:ring-red-500/50 rounded-lg',
    success: 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 focus:ring-green-500/50 rounded-lg',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const widthClass = isFullWidth ? 'w-full' : '';
  
  const classes = twMerge(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    className
  );
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
