import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyle =
    'px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  const variantStyle =
    variant === 'default'
      ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
      : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50 focus:ring-blue-500';

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};
