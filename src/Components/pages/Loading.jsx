import React from 'react';

const Loading = ({
  text = "",
  size = "md", // Options: "sm", "md", "lg", "xl"
  color = "primary", // Options: "primary", "secondary", "accent", "white"
  overlay = true, // Toggles a semi-transparent full-screen overlay
  fullScreen = true, // Centers the loading indicator in the full viewport
  textColor = "text-white", // New prop for custom text color
  type = "spinner", // New prop: "spinner" or "skeleton"
  skeletonType = "fees" // New prop: "fees", "attendance", or "students"
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

  // Fees Management Skeleton Loading Component
  const FeesSkeletonLoading = () => {
    return (
      <div className="animate-pulse w-full max-w-6xl mx-auto p-4">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pt-3 mb-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Controls Skeleton */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded w-1/6"></div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[...Array(8)].map((_, index) => (
                    <th key={index} className="px-4 py-3">
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {[...Array(8)].map((_, colIndex) => (
                      <td key={colIndex} className="px-4 py-3">
                        <div className="flex items-center">
                          {colIndex === 0 && (
                            <div className="flex items-center space-x-3">
                              <div className="h-6 w-6 bg-gray-200 rounded"></div>
                              <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                          )}
                          {colIndex === 1 && (
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                          )}
                          {colIndex === 2 && (
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          )}
                          {colIndex === 3 && (
                            <div className="flex flex-col items-center">
                              <div className="h-4 bg-gray-200 rounded w-12 mb-1"></div>
                              <div className="h-3 bg-gray-200 rounded w-16"></div>
                            </div>
                          )}
                          {colIndex === 4 && (
                            <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                          )}
                          {colIndex === 5 && (
                            <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                          )}
                          {colIndex === 6 && (
                            <div className="flex justify-center">
                              <div className="h-6 bg-gray-200 rounded w-20"></div>
                            </div>
                          )}
                          {colIndex === 7 && (
                            <div className="flex justify-center space-x-2">
                              <div className="h-8 bg-gray-200 rounded w-16"></div>
                              <div className="h-8 bg-gray-200 rounded w-16"></div>
                              <div className="h-8 bg-gray-200 rounded w-16"></div>
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Skeleton */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 bg-white">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="flex items-center space-x-2">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-8"></div>
              <div className="h-8 bg-gray-200 rounded w-8"></div>
              <div className="h-8 bg-gray-200 rounded w-8"></div>
              <div className="h-8 bg-gray-200 rounded w-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Attendance Management Skeleton Loading Component
  const AttendanceSkeletonLoading = () => {
    return (
      <div className="animate-pulse w-full max-w-6xl mx-auto p-4">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Search and Filters Skeleton */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
            <div className="flex-grow max-w-md">
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          
          {/* Filters Skeleton */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-10 bg-gray-200 rounded w-40"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-10 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.from({ length: 6 }, (_, index) => (
                <tr key={index} className="animate-pulse">
                  {/* Student Column Skeleton */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div className="ml-4 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Roll No Skeleton */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  
                  {/* Class Skeleton */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  
                  {/* Section Skeleton */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </td>
                  
                  {/* Status Skeleton */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </td>
                  
                  {/* Report Skeleton */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Students Management Skeleton Loading Component
  const StudentsSkeletonLoading = () => {
    return (
      <div className="animate-pulse w-full max-w-6xl mx-auto p-4">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Controls Section Skeleton */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar Skeleton */}
            <div className="relative w-full lg:w-1/3">
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
            
            {/* Button Group Skeleton */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-40"></div>
            </div>
          </div>
        </div>

        {/* Stats Summary Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="rounded-full bg-gray-200 p-3 mr-4">
                  <div className="w-6 h-6"></div>
                </div>
                <div>
                  <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[...Array(9)].map((_, index) => (
                    <th key={index} className="px-6 py-3">
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.from({ length: 6 }, (_, rowIndex) => (
                  <tr key={rowIndex} className="animate-pulse">
                    {/* Serial Number Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </td>
                    
                    {/* Roll No Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </td>
                    
                    {/* Photo Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    </td>
                    
                    {/* Name Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    
                    {/* Father Name Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    
                    {/* Class Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    
                    {/* Section Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </td>
                    
                    {/* Gender Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </td>
                    
                    {/* Actions Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="h-6 bg-gray-200 rounded w-6"></div>
                        <div className="h-6 bg-gray-200 rounded w-6"></div>
                        <div className="h-6 bg-gray-200 rounded w-6"></div>
                        <div className="h-6 bg-gray-200 rounded w-6"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-48 mb-4 sm:mb-0"></div>
          <div className="flex items-center space-x-1">
            <div className="h-8 bg-gray-200 rounded w-8"></div>
            <div className="h-8 bg-gray-200 rounded w-8"></div>
            <div className="h-8 bg-gray-200 rounded w-8"></div>
            <div className="h-8 bg-gray-200 rounded w-8"></div>
            <div className="h-8 bg-gray-200 rounded w-8"></div>
          </div>
        </div>
      </div>
    );
  };

  if (type === "skeleton") {
    if (skeletonType === "attendance") {
      return <AttendanceSkeletonLoading />;
    } else if (skeletonType === "students") {
      return <StudentsSkeletonLoading />;
    }
    return <FeesSkeletonLoading />;
  }

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