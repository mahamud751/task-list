"use client";

import { useDatabase } from "./DatabaseProvider";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";

export default function TopNavbar({
  activeView,
  onViewChange,
  onOpenUserManagement, // Add this prop
}: {
  activeView: string;
  onViewChange: (view: string) => void;
  onOpenUserManagement?: () => void; // Add this prop
}) {
  const { currentUser, logout } = useDatabase();
  const { theme } = useTheme();

  const navItems = [
    { id: "sprints", label: "Sprints" },
    { id: "timeline", label: "Timeline" },
    // Removed "board" option as requested
  ];

  const handleLogout = () => {
    logout();
  };

  // Theme-based colors
  const navbarBgColor =
    theme === "dark"
      ? "dark:bg-gray-800/90 backdrop-blur-sm"
      : "bg-white/90 backdrop-blur-sm";

  const navItemActiveBgColor =
    theme === "dark"
      ? "dark:bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
      : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md";
  const navItemInactiveTextColor =
    theme === "dark"
      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900";
  const searchInputBgColor = theme === "dark" ? "dark:bg-gray-700" : "bg-white";
  const searchInputBorderColor =
    theme === "dark" ? "dark:border-gray-600" : "border-gray-300";
  const searchInputTextColor =
    theme === "dark" ? "dark:text-white" : "text-gray-900";
  const userMenuBgColor = theme === "dark" ? "dark:bg-gray-800" : "bg-white";
  const userMenuBorderColor =
    theme === "dark" ? "dark:border-gray-700" : "border-gray-200";
  const userMenuTextColor =
    theme === "dark" ? "text-gray-300" : "text-gray-700";
  const userMenuHoverBgColor =
    theme === "dark" ? "dark:hover:bg-gray-700" : "hover:bg-gray-100";

  return (
    <header
      className={`shadow-lg fixed top-0 left-0 right-0 z-30 ${navbarBgColor} border-b ${
        theme === "dark" ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1
                className={`text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}
              >
                TaskFlow
              </h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      activeView === item.id
                        ? navItemActiveBgColor
                        : navItemInactiveTextColor
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                className={`pl-10 pr-4 py-2 rounded-full border ${searchInputBgColor} ${searchInputBorderColor} ${searchInputTextColor} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-sm w-64`}
              />
              <div
                className={`absolute left-3 top-2.5 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-400"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>
            <ThemeToggle />
            {currentUser && (
              <div className="flex items-center space-x-3">
                {/* Add User Management button for admin users */}
                {currentUser.role === "admin" && onOpenUserManagement && (
                  <button
                    onClick={onOpenUserManagement}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md"
                  >
                    Create User
                  </button>
                )}
                <div className="relative group">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div
                    className={`absolute right-0 mt-2 w-48 ${userMenuBgColor} rounded-xl shadow-xl py-2 hidden group-hover:block z-50 ${userMenuBorderColor} border transition-all duration-300 origin-top-right`}
                  >
                    <div
                      className={`px-4 py-3 text-sm border-b ${userMenuBorderColor} ${userMenuTextColor}`}
                    >
                      <div className="font-bold">{currentUser.name}</div>
                      <div
                        className={`text-xs mt-1 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {currentUser.email}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm ${userMenuTextColor} ${userMenuHoverBgColor} transition-colors duration-200 rounded-b-xl`}
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          ></path>
                        </svg>
                        Sign out
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}