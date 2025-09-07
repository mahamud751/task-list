"use client";

import { useState, useEffect } from "react";
import { useDatabase } from "./DatabaseProvider";
import { motion } from "framer-motion";
import SprintSelector from "./SprintSelector";
import { useTheme } from "./ThemeProvider";

interface FilterOptions {
  searchTerm: string;
  priority: string;
  assignee: string;
  module: string;
  target: string;
}

export default function Dashboard({ filters }: { filters: FilterOptions }) {
  const { sprints, currentSprint, refreshSprints } = useDatabase();
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
  });

  // Calculate stats based on current sprint or all sprints
  useEffect(() => {
    if (sprints.length > 0) {
      let total = 0;
      let completed = 0;
      let inProgress = 0;
      let todo = 0;

      const sprintsToCalculate = currentSprint
        ? [sprints.find((s) => s.id === currentSprint.id)].filter(Boolean)
        : sprints;

      sprintsToCalculate.forEach((sprint) => {
        sprint.tasks.forEach((task: any) => {
          // Apply filters
          const matchesSearch =
            filters.searchTerm === "" ||
            task.title
              .toLowerCase()
              .includes(filters.searchTerm.toLowerCase()) ||
            task.taskId
              .toLowerCase()
              .includes(filters.searchTerm.toLowerCase()) ||
            (task.description &&
              task.description
                .toLowerCase()
                .includes(filters.searchTerm.toLowerCase()));

          const matchesPriority =
            filters.priority === "all" || task.priority === filters.priority;

          const matchesAssignee =
            filters.assignee === "all" ||
            (task.assignee?.name &&
              task.assignee.name
                .toLowerCase()
                .includes(filters.assignee.toLowerCase()));

          const matchesModule =
            filters.module === "all" ||
            (task.module &&
              task.module.toLowerCase().includes(filters.module.toLowerCase()));

          const matchesTarget =
            filters.target === "all" ||
            (task.target &&
              task.target.toLowerCase().includes(filters.target.toLowerCase()));

          if (
            matchesSearch &&
            matchesPriority &&
            matchesAssignee &&
            matchesModule &&
            matchesTarget
          ) {
            total++;
            if (task.progress === 100) {
              completed++;
            } else if (task.progress > 0) {
              inProgress++;
            } else {
              todo++;
            }
          }
        });
      });

      setStats({
        totalTasks: total,
        completedTasks: completed,
        inProgressTasks: inProgress,
        todoTasks: todo,
      });
    }
  }, [sprints, currentSprint, filters]);

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

  // Theme-based colors
  const headerTextColor = theme === "dark" ? "text-white" : "text-gray-900";
  const subheaderTextColor =
    theme === "dark" ? "text-gray-400" : "text-gray-600";
  const cardBgColor = theme === "dark" ? "dark:bg-gray-800" : "bg-white";
  const cardBorderColor =
    theme === "dark" ? "dark:border-gray-700" : "border-gray-200";
  const statLabelColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const statValueColor = theme === "dark" ? "text-white" : "text-gray-900";
  const progressBarBgColor =
    theme === "dark" ? "dark:bg-gray-700" : "bg-gray-200";

  return (
    <div
      className={`p-6 pt-20 ${
        theme === "dark" ? "dark:bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <motion.h1
            className={`text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Dashboard
          </motion.h1>
          <div className="w-64">
            <SprintSelector />
          </div>
        </div>
        <motion.p
          className={`mt-2 ${subheaderTextColor}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {currentSprint
            ? `Overview of ${currentSprint.name}`
            : "Overview of all sprints"}
        </motion.p>
      </div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className={`${cardBgColor} rounded-xl shadow-lg p-6 ${cardBorderColor} border transition-all duration-300 hover:shadow-xl`}
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className={`text-sm font-medium ${statLabelColor}`}>
                Total Tasks
              </h3>
              <p className={`text-2xl font-bold ${statValueColor}`}>
                {stats.totalTasks}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={`${cardBgColor} rounded-xl shadow-lg p-6 ${cardBorderColor} border transition-all duration-300 hover:shadow-xl`}
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-md">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className={`text-sm font-medium ${statLabelColor}`}>
                Completed
              </h3>
              <p className={`text-2xl font-bold ${statValueColor}`}>
                {stats.completedTasks}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={`${cardBgColor} rounded-xl shadow-lg p-6 ${cardBorderColor} border transition-all duration-300 hover:shadow-xl`}
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 shadow-md">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className={`text-sm font-medium ${statLabelColor}`}>
                In Progress
              </h3>
              <p className={`text-2xl font-bold ${statValueColor}`}>
                {stats.inProgressTasks}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={`${cardBgColor} rounded-xl shadow-lg p-6 ${cardBorderColor} border transition-all duration-300 hover:shadow-xl`}
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 shadow-md">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className={`text-sm font-medium ${statLabelColor}`}>To Do</h3>
              <p className={`text-2xl font-bold ${statValueColor}`}>
                {stats.todoTasks}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Sprints Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2
          className={`text-2xl font-bold ${headerTextColor} mb-4 flex items-center`}
        >
          Sprints
          <span className="ml-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-normal px-2 py-1 rounded-full">
            {sprints.length}
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sprints.map((sprint, index) => (
            <motion.div
              key={sprint.id}
              className={`${cardBgColor} rounded-xl shadow-lg p-6 ${cardBorderColor} border transition-all duration-300 hover:shadow-xl cursor-pointer`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ y: -10 }}
              onClick={() => console.log("Navigate to sprint:", sprint.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-lg font-bold ${headerTextColor}`}>
                    {sprint.name}
                  </h3>
                  {sprint.description && (
                    <p
                      className={`text-sm mt-1 line-clamp-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {sprint.description}
                    </p>
                  )}
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${getStatusColor(
                    sprint.status
                  )} text-white shadow-sm`}
                >
                  {getStatusText(sprint.status)}
                </span>
              </div>

              <div className="mt-4">
                <div
                  className={`flex justify-between text-sm mb-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <span>Progress</span>
                  <span>
                    {sprint.tasks.filter((t: any) => t.progress === 100).length}{" "}
                    / {sprint.tasks.length} completed
                  </span>
                </div>
                <div
                  className={`w-full rounded-full h-2.5 ${progressBarBgColor}`}
                >
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        sprint.tasks.length > 0
                          ? `${
                              (sprint.tasks.filter(
                                (t: any) => t.progress === 100
                              ).length /
                                sprint.tasks.length) *
                              100
                            }%`
                          : "0%",
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  ></motion.div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {sprint.startDate && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      theme === "dark"
                        ? "bg-green-900/30 text-green-300"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    Start: {new Date(sprint.startDate).toLocaleDateString()}
                  </span>
                )}
                {sprint.endDate && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      theme === "dark"
                        ? "bg-purple-900/30 text-purple-300"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    End: {new Date(sprint.endDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div
                className={`mt-4 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {sprint.tasks.length} tasks
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
