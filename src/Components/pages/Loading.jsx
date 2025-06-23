import React from 'react';

const Loading = ({
  text = "",
  size = "md", // Options: "sm", "md", "lg", "xl"
  color = "primary", // Options: "primary", "secondary", "accent", "white"
  overlay = true, // Toggles a semi-transparent full-screen overlay
  fullScreen = true, // Centers the loading indicator in the full viewport
  textColor = "text-white" // New prop for custom text color
}) => {
  // Define Tailwind CSS classes for sizes
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  // Define Tailwind CSS classes for spinner colors
  const spinnerColorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    accent: 'text-indigo-600',
    white: 'text-white'
  };

  // Base container classes for positioning and overlay
  const containerBaseClasses = 'flex items-center justify-center z-50';
  const containerPositionClasses = fullScreen ? 'fixed inset-0' : 'relative';
  const containerOverlayClasses = overlay && fullScreen ? 'bg-black bg-opacity-50' : '';

  // Combine container classes
  const containerClasses = `${containerBaseClasses} ${containerPositionClasses} ${containerOverlayClasses}`;

  // Combine spinner classes
  const spinnerClasses = `
    animate-spin
    ${sizeClasses[size]}
    ${spinnerColorClasses[color]}
  `;

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-4">
        <svg
          className={spinnerClasses}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {text && <span className={`${textColor} text-lg font-semibold`}>{text}</span>}
      </div>
    </div>
  );
};

export default Loading;