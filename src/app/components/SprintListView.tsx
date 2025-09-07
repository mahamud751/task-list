"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FloatingActionButton from "./FloatingActionButton";
import SprintCreateModal from "./SprintCreateModal";
import { useDatabase } from "./DatabaseProvider";
import { useTheme } from "./ThemeProvider";

interface FilterOptions {
  searchTerm: string;
  priority: string;
  assignee: string;
  module: string;
  target: string;
}

export default function SprintListView({
  onSprintSelect,
  onFilterChange,
  filters,
}: {
  onSprintSelect: (sprint: any) => void;
  onFilterChange: (filters: FilterOptions) => void;
  filters: FilterOptions;
}) {
  const { sprints, addSprint } = useDatabase();
  const { theme } = useTheme();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filteredSprints, setFilteredSprints] = useState(sprints);

  useEffect(() => {
    // Filter sprints based on search term
    const filtered = sprints.filter(
      (sprint) =>
        sprint.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (sprint.description &&
          sprint.description
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase()))
    );
    setFilteredSprints(filtered);
  }, [sprints, filters.searchTerm]);

  const handleCreateSprint = (sprint: {
    name: string;
    description: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }) => {
    addSprint(sprint);
    setIsCreateModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      case "completed":
        return "bg-gradient-to-r from-blue-500 to-indigo-500";
      case "planned":
        return "bg-gradient-to-r from-yellow-500 to-amber-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-white";
      case "completed":
        return "text-white";
      case "planned":
        return "text-white";
      default:
        return "text-white";
    }
  };

  // Theme-based colors
  const headerTextColor = theme === "dark" ? "text-white" : "text-gray-900";
  const cardBgColor = theme === "dark" ? "dark:bg-gray-800" : "bg-white";
  const cardBorderColor =
    theme === "dark" ? "dark:border-gray-700" : "border-gray-200";
  const descriptionTextColor =
    theme === "dark" ? "text-gray-300" : "text-gray-600";
  const dateTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <div
      className={`p-6 ${theme === "dark" ? "dark:bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${headerTextColor}`}>Sprints</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSprints.map((sprint, index) => (
          <motion.div
            key={sprint.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{
              y: -10,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            className={`${cardBgColor} rounded-xl shadow-lg overflow-hidden cursor-pointer ${cardBorderColor} border transition-all duration-300 transform hover:scale-[1.02]`}
            onClick={() => onSprintSelect(sprint)}
          >
            <div className={`h-2 ${getStatusColor(sprint.status)}`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className={`text-lg font-bold ${headerTextColor}`}>
                  {sprint.name}
                </h2>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                    sprint.status
                  )} ${getStatusTextColor(sprint.status)} shadow-sm`}
                >
                  {sprint.status}
                </span>
              </div>
              {sprint.description && (
                <p className={`mt-3 ${descriptionTextColor} line-clamp-2`}>
                  {sprint.description}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {sprint.startDate && (
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <span>
                      {new Date(sprint.startDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {sprint.endDate && (
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <span>{new Date(sprint.endDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {sprint.tasks?.length || 0} tasks
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <FloatingActionButton onClick={() => setIsCreateModalOpen(true)} />

      <SprintCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSprint}
      />
    </div>
  );
}
