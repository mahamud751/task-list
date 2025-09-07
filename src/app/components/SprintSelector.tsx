"use client";

import { useState } from "react";
import { useDatabase } from "./DatabaseProvider";
import { motion } from "framer-motion";

export default function SprintSelector() {
  const { sprints, currentSprint, setCurrentSprint } = useDatabase();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      case "planned":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "completed":
        return "Completed";
      case "planned":
        return "Planned";
      default:
        return status;
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center">
          {currentSprint ? (
            <>
              <span
                className={`w-3 h-3 rounded-full ${getStatusColor(
                  currentSprint.status
                )} mr-2`}
              ></span>
              <span>{currentSprint.name}</span>
            </>
          ) : (
            <span>Select a sprint</span>
          )}
        </div>
        <svg
          className={`w-5 h-5 ml-2 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </motion.button>

      {isDropdownOpen && (
        <motion.div
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg dark:bg-gray-800"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="py-1">
            <button
              onClick={() => {
                setCurrentSprint(null);
                setIsDropdownOpen(false);
              }}
              className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              All Sprints
            </button>
            {sprints.map((sprint) => (
              <button
                key={sprint.id}
                onClick={() => {
                  setCurrentSprint(sprint);
                  setIsDropdownOpen(false);
                }}
                className={`block w-full px-4 py-2 text-sm text-left ${
                  currentSprint?.id === sprint.id
                    ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{sprint.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                      sprint.status
                    )} text-white`}
                  >
                    {getStatusText(sprint.status)}
                  </span>
                </div>
                {sprint.description && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {sprint.description}
                  </div>
                )}
                <div className="flex text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {sprint.startDate && (
                    <span className="mr-2">
                      Start: {new Date(sprint.startDate).toLocaleDateString()}
                    </span>
                  )}
                  {sprint.endDate && (
                    <span>
                      End: {new Date(sprint.endDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
