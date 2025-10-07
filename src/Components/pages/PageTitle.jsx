import React from "react";

const PageTitle = ({ 
  // Basic props
  title, 
  description, 
  icon: Icon, 
  stats = [],
  
  // Styling props
  bgGradient = "bg-gradient-to-r from-blue-50 to-indigo-50",
  borderColor = "border-blue-200",
  iconBg = "bg-gradient-to-r from-blue-500 to-blue-600",
  iconColor = "text-white",
  titleColor = "text-gray-800",
  descriptionColor = "text-gray-600",
  
  // Border control
  showBorder = true,
  
  // Filter & Download props (for Balance Sheet, Income, Expense pages)
  showFilters = false,
  filterPeriod,
  setFilterPeriod,
  filterYear,
  setFilterYear,
  filterMonth,
  setFilterMonth,
  onDownload,
  years = [],
  months = [],
  
  // Fees Management props
  showFeesHeader = false,
  searchTerm,
  setSearchTerm,
  searchPlaceholder = "Search students by name, roll number, or father's name...",
  onFilterClick,
  onDueListClick,
  onExportClick,
  showStatusBadge = false,
  statusBadgeColor = "bg-green-400",
  
  // Attendance Management props
  showAttendanceHeader = false,
  userRole,
  classAssigned,
  classSection,
  onFilterToggle,
  onReportChange,
  onSubmitAttendance,
  isSubmitDisabled = false,

  // Student Details props
  showStudentHeader = false,
  teacherClass,
  teacherSection,

  // User Management props
  showUserHeader = false,

  // Staff Attendance props
  showStaffHeader = false,
  onStaffFilterToggle,
  onStaffReportChange,
  onStaffSubmitAttendance,
  isStaffSubmitDisabled = false,
  submitting = false
}) => {
  return (
    <div className={`pt-4 pb-3 ${showBorder ? `border-b ${borderColor}` : ''} ${bgGradient} rounded-lg px-4 shadow-sm`}>
      
      {/* Staff Attendance Header */}
      {showStaffHeader ? (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-full shadow-sm mr-3">
              {Icon ? (
                <Icon className="text-indigo-600 text-xl" />
              ) : (
                <svg className="text-indigo-600 text-xl" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {title || "Staff Attendance"}
              </h1>
              <p className="text-sm text-gray-600">
                {description || "Manage staff attendance records"}
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={onStaffFilterToggle}
              className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              <svg className="text-gray-500" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filters
            </button>

            <div className="relative">
              <select
                onChange={onStaffReportChange}
                className="border cursor-pointer border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-colors"
                defaultValue=""
              >
                <option value="" disabled>Reports</option>
                <option value="weekly">Weekly Report</option>
                <option value="monthly">Monthly Report</option>
                <option value="previous">Previous Month</option>
                <option value="yearly">Yearly Report</option>
                <option value="custom">Custom Report...</option>
              </select>
            </div>

            <button
              onClick={onStaffSubmitAttendance}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isStaffSubmitDisabled || submitting}
            >
              {submitting ? "Submitting..." : "Submit Attendance"}
            </button>
          </div>
        </div>
      ) : showUserHeader ? (
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            {Icon ? (
              <Icon className="w-6 h-6 text-blue-600" />
            ) : (
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {title || "User Management"}
            </h1>
            <p className="text-gray-600 mt-1">
              {description || "Manage all user accounts and permissions"}
            </p>
          </div>
        </div>
      ) : showStudentHeader ? (
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            {Icon ? (
              <Icon className="w-6 h-6 text-blue-600" />
            ) : (
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {title}
            </h1>
            <p className="text-gray-600 mt-1">
              {userRole === "Teacher"
                ? `Viewing students from ${teacherClass} - Section ${teacherSection}`
                : description || "Manage all student records"}
            </p>
          </div>
        </div>
      ) : showAttendanceHeader ? (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-full shadow-sm mr-3">
              {Icon && <Icon className="text-indigo-600 text-xl" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
              <p className="text-sm text-gray-600">
                {userRole === "Teacher" ? (
                  <>Class: {classAssigned || "N/A"}, Section: {classSection || "N/A"}</>
                ) : (
                  description || "Manage student attendance records"
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={onFilterToggle}
              className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              <svg className="text-gray-500" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filters
            </button>

            <select
              onChange={onReportChange}
              className="border cursor-pointer border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-colors"
              defaultValue=""
            >
              <option value="" disabled>Reports</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="previous">Previous Month</option>
              <option value="yearly">Yearly Report</option>
            </select>

            <button
              onClick={onSubmitAttendance}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isSubmitDisabled}
            >
              Submit Attendance
            </button>
          </div>
        </div>
      ) : showFeesHeader ? (
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          {/* Page Title Section */}
          <div className="flex items-center">
            <div className="relative group">
              <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center shadow-lg mr-4 transform group-hover:scale-105 transition-transform duration-300`}>
                {Icon && <Icon className={iconColor} size={26} />}
              </div>
              {showStatusBadge && (
                <div className={`absolute -top-1 -right-1 w-6 h-6 ${statusBadgeColor} rounded-full border-2 border-white flex items-center justify-center`}>
                  <svg className="text-white" width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h1 className={`text-2xl lg:text-3xl font-bold ${titleColor}`}>
                {title}
              </h1>
              {description && (
                <p className={`${descriptionColor} text-sm mt-1`}>
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Search and Actions Section */}
          <div className="flex flex-col lg:flex-row gap-4 flex-1 lg:max-w-2xl">
            {/* Enhanced Search Bar */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="text-gray-400 group-focus-within:text-blue-500 transition-colors" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full pl-12 pr-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onFilterClick}
                className="flex items-center px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-200 group min-w-[60px] sm:min-w-[120px] justify-center"
              >
                <svg className="sm:mr-3 text-gray-500 group-hover:text-blue-600" width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline font-semibold">Filter</span>
                <span className="sm:hidden sr-only">Filter</span>
              </button>

              <button
                onClick={onDueListClick}
                className="flex items-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 hover:shadow-xl transform hover:scale-105 transition-all duration-200 shadow-lg min-w-[60px] sm:min-w-[140px] justify-center"
              >
                <svg className="sm:mr-3" width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline font-semibold">Due List</span>
                <span className="sm:hidden sr-only">Due List</span>
              </button>

              <button
                onClick={onExportClick}
                className="flex items-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 hover:shadow-xl transform hover:scale-105 transition-all duration-200 shadow-lg min-w-[60px] sm:min-w-[120px] justify-center"
              >
                <svg className="sm:mr-3" width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline font-semibold">Export</span>
                <span className="sm:hidden sr-only">Export</span>
              </button>
            </div>
          </div>
        </div>
      ) : showFilters ? (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Section - Title, Icon and Description */}
          <div className="flex items-center gap-3 flex-1">
            {/* Icon */}
            {Icon && (
              <div className={`p-2 ${iconBg} rounded-lg shadow-sm`}>
                <Icon className={`h-6 w-6 ${iconColor}`} size={24} />
              </div>
            )}
            
            {/* Title and Description */}
            <div className="flex-1">
              <h1 className={`text-xl sm:text-2xl font-bold ${titleColor} mb-1`}>
                {title}
              </h1>
              <p className={`${descriptionColor} text-xs sm:text-sm`}>
                {description}
              </p>
            </div>
          </div>

          {/* Right Section - Filters & Download */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-28 relative">
                <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Filter Period</label>
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="w-full border-2 border-gray-200 bg-transparent text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-400 transition-colors"
                >
                  <option value="yearly">Yearly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Year</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(Number(e.target.value))}
                  className="w-full border-2 border-gray-200 bg-transparent text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-400 transition-colors"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {filterPeriod === "monthly" && (
                <div className="relative">
                  <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Month</label>
                  <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(Number(e.target.value))}
                    className="w-full border-2 border-gray-200 bg-transparent text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-400 transition-colors"
                  >
                    {months.map(month => (
                      <option key={month.value} value={month.value}>{month.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Download Button */}
            <button
              onClick={onDownload}
              className="border-2 border-blue-500 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v7a1 1 0 11-2 0V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Download</span>
            </button>
          </div>
        </div>
      ) : (
        // Default Layout (with Stats)
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Section - Title, Icon and Description */}
          <div className="flex items-center gap-3 flex-1">
            {/* Icon */}
            {Icon && (
              <div className={`p-2 ${iconBg} rounded-lg shadow-sm`}>
                <Icon className={`h-6 w-6 ${iconColor}`} size={24} />
              </div>
            )}
            
            {/* Title and Description */}
            <div className="flex-1">
              <h1 className={`text-xl sm:text-2xl font-bold ${titleColor} mb-1`}>
                {title}
              </h1>
              <p className={`${descriptionColor} text-xs sm:text-sm`}>
                {description}
              </p>
            </div>
          </div>

          {/* Right Section - Stats */}
          {stats.length > 0 && (
            <div className="hidden lg:flex items-center gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-lg font-bold ${stat.color || "text-blue-600"}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageTitle;