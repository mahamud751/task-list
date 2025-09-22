"use client";

import { useState } from "react";
import SprintSelector from "./SprintSelector";
import { useDatabase } from "./DatabaseProvider";
import { useTheme } from "./ThemeProvider";

interface FilterOptions {
  searchTerm: string;
  priority: string;
  assignee: string;
  module: string;
  target: string;
}

export default function Sidebar({
  onFilterChange,
}: {
  onFilterChange: (filters: FilterOptions) => void;
}) {
  const { currentUser, users } = useDatabase(); // Get users from DatabaseProvider
  const { theme } = useTheme();
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    priority: "all",
    assignee: "all",
    module: "all",
    target: "all",
  });

  const handleFilterChange = (
    filterName: keyof FilterOptions,
    value: string
  ) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Theme-based colors
  const sidebarBgColor = theme === "dark" ? "dark:bg-gray-800" : "bg-white";
  const sidebarBorderColor =
    theme === "dark" ? "dark:border-gray-700" : "border-gray-200";
  const headerTextColor = theme === "dark" ? "text-white" : "text-gray-900";
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
  const inputBgColor = theme === "dark" ? "dark:bg-gray-700" : "bg-white";
  const inputBorderColor =
    theme === "dark" ? "dark:border-gray-600" : "border-gray-300";
  const inputTextColor = theme === "dark" ? "dark:text-white" : "text-gray-900";
  const selectBgColor = theme === "dark" ? "dark:bg-gray-700" : "bg-white";
  const selectBorderColor =
    theme === "dark" ? "dark:border-gray-600" : "border-gray-300";
  const selectTextColor =
    theme === "dark" ? "dark:text-white" : "text-gray-900";

  return (
    <div
      className={`w-64 fixed left-0 top-16 bottom-0 shadow-lg z-40 overflow-y-auto ${sidebarBgColor} ${sidebarBorderColor} border-r`}
    >
      <div className={`p-4 ${sidebarBorderColor} border-b`}>
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

      <div className="p-4">
        <SprintSelector />
      </div>

      <div className={`p-4 ${sidebarBorderColor} border-t`}>
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
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} transition-colors duration-200`}
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
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${selectBgColor} ${selectBorderColor} ${selectTextColor} transition-colors duration-200`}
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
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${selectBgColor} ${selectBorderColor} ${selectTextColor} transition-colors duration-200`}
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
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${selectBgColor} ${selectBorderColor} ${selectTextColor} transition-colors duration-200`}
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
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${selectBgColor} ${selectBorderColor} ${selectTextColor} transition-colors duration-200`}
              value={filters.target}
              onChange={(e) => handleFilterChange("target", e.target.value)}
            >
              <option value="all">All Targets</option>
              <option value="Web">Web</option>
              <option value="Mobile">Mobile</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
