"use client";

import { useState, useEffect } from "react";
import { useDatabase } from "./DatabaseProvider";
import { useTheme } from "./ThemeProvider";

interface FilterOptions {
  searchTerm: string;
  priority: string;
  assignee: string;
  module: string;
  target: string;
  sprintId: string; // Add sprintId filter
}

export default function Sidebar({
  onFilterChange,
  currentFilters, // Add currentFilters prop
}: {
  onFilterChange: (filters: FilterOptions) => void;
  currentFilters?: FilterOptions; // Add currentFilters prop
}) {
  const { currentUser, users, sprints } = useDatabase(); // Get users and sprints from DatabaseProvider
  const { theme } = useTheme();
  const [filters, setFilters] = useState<FilterOptions>(
    currentFilters || {
      searchTerm: "",
      priority: "all",
      assignee: "all",
      module: "all",
      target: "all",
      sprintId: "all", // Add sprintId filter
    }
  );

  // Sync filters with currentFilters when it changes
  useEffect(() => {
    if (currentFilters) {
      setFilters(currentFilters);
    }
  }, [currentFilters]);

  const handleFilterChange = (
    filterName: keyof FilterOptions,
    value: string
  ) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Theme-based colors
  const headerTextColor = theme === "dark" ? "text-white" : "text-gray-900";
  const secondaryTextColor = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const mutedTextColor = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const roleBadgeBgColor = (role: string) => {
    switch (role) {
      case "admin":
        return theme === "dark"
          ? "dark:bg-purple-800 dark:text-purple-100"
          : "bg-purple-100 text-purple-800";
      case "developer":
        return theme === "dark"
          ? "dark:bg-blue-800 dark:text-blue-100"
          : "bg-blue-100 text-blue-800";
      default:
        return theme === "dark"
          ? "dark:bg-green-800 dark:text-green-100"
          : "bg-green-100 text-green-800";
    }
  };
  const filterLabelColor = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const inputBgColor = theme === "dark" ? "dark:bg-gray-700/50" : "bg-white/50";
  const inputBorderColor = theme === "dark" ? "dark:border-gray-600" : "border-gray-300";
  const inputTextColor = theme === "dark" ? "dark:text-white" : "text-gray-900";
  const placeholderTextColor = theme === "dark" ? "dark:placeholder-gray-400" : "placeholder-gray-500";
  const selectBgColor = theme === "dark" ? "dark:bg-gray-700/50" : "bg-white/50";
  const selectBorderColor = theme === "dark" ? "dark:border-gray-600" : "border-gray-300";
  const selectTextColor = theme === "dark" ? "dark:text-white" : "text-gray-900";

  return (
    <div
      className={`w-64 fixed left-0 top-16 bottom-0 shadow-lg z-40 overflow-y-auto glass-card border-r`}
    >
      <div className={`p-4 border-b`}>
        <h1 className={`text-xl font-bold ${headerTextColor}`}>Filters</h1>
        {currentUser && (
          <div className="mt-2 flex items-center text-sm">
            <span
              className={`px-2 py-1 rounded-full text-xs ${roleBadgeBgColor(
                currentUser.role
              )}`}
            >
              {currentUser.role}
            </span>
          </div>
        )}
      </div>

      {/* <div className="p-4">
        <SprintSelector />
      </div> */}

      <div className={`p-4 border-t`}>
        <h3 className={`text-sm font-medium ${headerTextColor} mb-3`}>
          Task Filters
        </h3>
        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium ${filterLabelColor} mb-1`}
            >
              Search
            </label>
            <input
              type="text"
              placeholder="Search tasks..."
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 glass-card transition-colors duration-200 ${inputBgColor} ${inputBorderColor} ${inputTextColor} ${placeholderTextColor}`}
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${filterLabelColor} mb-1`}
            >
              Priority
            </label>
            <select
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 glass-card transition-colors duration-200 ${selectBgColor} ${selectBorderColor} ${selectTextColor}`}
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${filterLabelColor} mb-1`}
            >
              Assignee
            </label>
            <select
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 glass-card transition-colors duration-200 ${selectBgColor} ${selectBorderColor} ${selectTextColor}`}
              value={filters.assignee}
              onChange={(e) => handleFilterChange("assignee", e.target.value)}
            >
              <option value="all">All Assignees</option>
              {/* Dynamically generate assignee options from users data */}
              {users.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${filterLabelColor} mb-1`}
            >
              Module
            </label>
            <select
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 glass-card transition-colors duration-200 ${selectBgColor} ${selectBorderColor} ${selectTextColor}`}
              value={filters.module}
              onChange={(e) => handleFilterChange("module", e.target.value)}
            >
              <option value="all">All Modules</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="App">App</option>
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${filterLabelColor} mb-1`}
            >
              Target
            </label>
            <select
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 glass-card transition-colors duration-200 ${selectBgColor} ${selectBorderColor} ${selectTextColor}`}
              value={filters.target}
              onChange={(e) => handleFilterChange("target", e.target.value)}
            >
              <option value="all">All Targets</option>
              <option value="Web">Web</option>
              <option value="Mobile">Mobile</option>
            </select>
          </div>

          {/* Sprint Filter */}
          <div>
            <label
              className={`block text-sm font-medium ${filterLabelColor} mb-1`}
            >
              Sprint
            </label>
            <select
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 glass-card transition-colors duration-200 ${selectBgColor} ${selectBorderColor} ${selectTextColor}`}
              value={filters.sprintId}
              onChange={(e) => handleFilterChange("sprintId", e.target.value)}
            >
              <option value="all">All Sprints</option>
              {sprints.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
