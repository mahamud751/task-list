"use client";

import { useState } from "react";
import { useDatabase } from "./DatabaseProvider";
import { useTheme } from "./ThemeProvider";

interface FloatingActionButtonProps {
  onClick: () => void;
}

export default function FloatingActionButton({
  onClick,
}: FloatingActionButtonProps) {
  const { hasPermission } = useDatabase();
  const { theme } = useTheme();
  const canCreateTask = hasPermission("create_task");

  const [isHovered, setIsHovered] = useState(false);

  if (!canCreateTask) {
    return null;
  }

  // Theme-based colors
  const focusRingColor =
    theme === "dark" ? "focus:ring-blue-500" : "focus:ring-blue-400";
  const buttonBgColor =
    theme === "dark"
      ? "bg-gradient-to-br from-indigo-600 to-purple-600"
      : "bg-gradient-to-br from-indigo-600 to-purple-600";
  const hoverBgColor =
    theme === "dark"
      ? "hover:from-indigo-700 hover:to-purple-700"
      : "hover:from-indigo-700 hover:to-purple-700";
  const borderColor =
    theme === "dark" ? "border-indigo-400/30" : "border-indigo-300/50";
  const boxShadow =
    theme === "dark"
      ? "shadow-lg hover:shadow-xl"
      : "shadow-lg hover:shadow-xl shadow-indigo-500/30";

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed bottom-8 right-8 w-16 h-16 rounded-full text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 ${focusRingColor} focus:ring-opacity-50 ${
        isHovered ? "rotate-90" : "rotate-0"
      } ${boxShadow} ${buttonBgColor} ${hoverBgColor} ${borderColor}`}
      aria-label="Add new task"
    >
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        {/* Pulsing animation effect */}
        {isHovered && (
          <div className="absolute inset-0 rounded-full bg-white opacity-30 animate-ping"></div>
        )}
      </div>
    </button>
  );
}
