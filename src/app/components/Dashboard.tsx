"use client";

import { useState, useEffect } from "react";
import { useDatabase } from "./DatabaseProvider";
import { motion } from "framer-motion";
import SprintSelector from "./SprintSelector";

interface FilterOptions {
  searchTerm: string;
  priority: string;
  assignee: string;
  module: string;
  target: string;
}

export default function Dashboard({ filters }: { filters: FilterOptions }) {
  const { sprints, currentSprint, refreshSprints } = useDatabase();
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
    <div className="p-6 pt-20">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <motion.h1
            className="text-2xl font-bold text-gray-900 dark:text-white"
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
          className="text-gray-600 dark:text-gray-400 mt-2"
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
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
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Tasks
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
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
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Completed
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completedTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <svg
                className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
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
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                In Progress
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.inProgressTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
              <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-400"
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
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                To Do
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.todoTasks}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sprints Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Sprints
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sprints.map((sprint, index) => (
            <motion.div
              key={sprint.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {sprint.name}
                  </h3>
                  {sprint.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {sprint.description}
                    </p>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                    sprint.status
                  )} text-white`}
                >
                  {getStatusText(sprint.status)}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>
                    {sprint.tasks.filter((t: any) => t.progress === 100).length}{" "}
                    / {sprint.tasks.length} completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
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
                  ></div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {sprint.startDate && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded dark:bg-green-900 dark:text-green-300">
                    Start: {new Date(sprint.startDate).toLocaleDateString()}
                  </span>
                )}
                {sprint.endDate && (
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded dark:bg-purple-900 dark:text-purple-300">
                    End: {new Date(sprint.endDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {sprint.tasks.length} tasks
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
