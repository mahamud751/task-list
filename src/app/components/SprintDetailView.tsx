"use client";

import { useState, useEffect } from "react";
import { useDatabase } from "./DatabaseProvider";
import { motion } from "framer-motion";
import Column from "./Column";
import FloatingActionButton from "./FloatingActionButton";
import TaskModal from "./TaskModal";
import TaskEditModal from "./TaskEditModal";
import TopNavbar from "./TopNavbar";
import { useTheme } from "./ThemeProvider";

interface CardType {
  id: string;
  taskId: string;
  title: string;
  description: string;
  priority: string;
  storyPoints?: number;
  assignee?: string;
  progress?: number;
  timeEstimate?: string;
  module?: string;
  target?: string;
  imageUrl?: string;
  sprintId?: string;
}

interface FilterOptions {
  searchTerm: string;
  priority: string;
  assignee: string;
  module: string;
  target: string;
}

export default function SprintDetailView({
  sprint,
  onBack,
  onFilterChange,
  filters,
  activeView,
  onViewChange,
}: {
  sprint: any;
  onBack: () => void;
  onFilterChange: (filters: FilterOptions) => void;
  filters: FilterOptions;
  activeView: string;
  onViewChange: (view: string) => void;
}) {
  const {
    columns,
    moveCard,
    addCard,
    updateCard,
    refreshData,
    hasPermission,
    users,
  } = useDatabase();
  const { theme } = useTheme();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CardType | null>(null);
  const [filteredColumns, setFilteredColumns] = useState(columns);
  const [localFilters, setLocalFilters] = useState(filters);

  // Apply filters whenever columns or filters change
  useEffect(() => {
    const filtered = columns.map((column) => {
      const filteredCards = column.cards.filter((card) => {
        // Check if card belongs to current sprint
        if (card.sprintId !== sprint.id) {
          return false;
        }

        // Search term filter
        const matchesSearch =
          localFilters.searchTerm === "" ||
          card.title
            .toLowerCase()
            .includes(localFilters.searchTerm.toLowerCase()) ||
          card.taskId
            .toLowerCase()
            .includes(localFilters.searchTerm.toLowerCase()) ||
          (card.description &&
            card.description
              .toLowerCase()
              .includes(localFilters.searchTerm.toLowerCase()));

        // Priority filter
        const matchesPriority =
          localFilters.priority === "all" ||
          card.priority === localFilters.priority;

        // Assignee filter
        const matchesAssignee =
          localFilters.assignee === "all" ||
          (card.assignee &&
            card.assignee
              .toLowerCase()
              .includes(localFilters.assignee.toLowerCase()));

        // Module filter
        const matchesModule =
          localFilters.module === "all" ||
          (card.module &&
            card.module
              .toLowerCase()
              .includes(localFilters.module.toLowerCase()));

        // Target filter
        const matchesTarget =
          localFilters.target === "all" ||
          (card.target &&
            card.target
              .toLowerCase()
              .includes(localFilters.target.toLowerCase()));

        return (
          matchesSearch &&
          matchesPriority &&
          matchesAssignee &&
          matchesModule &&
          matchesTarget
        );
      });

      return {
        ...column,
        cards: filteredCards,
      };
    });

    setFilteredColumns(filtered);
  }, [columns, sprint, localFilters]);

  const handleFilterChange = (
    filterName: keyof FilterOptions,
    value: string
  ) => {
    const newFilters = { ...localFilters, [filterName]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAddNewTask = (task: {
    title: string;
    description: string;
    priority: string;
    storyPoints?: number;
    assignee?: string;
    timeEstimate?: string;
    module?: string;
    target?: string;
    imageUrl?: string;
  }) => {
    // Add to the first column (To Do) and current sprint
    if (columns.length > 0) {
      addCard(columns[0].id, {
        ...task,
        sprintId: sprint.id, // Ensure task is assigned to current sprint
      });
    }
    setIsCreateModalOpen(false);
  };

  const handleUpdateTask = (updatedTask: CardType) => {
    // Find which column the task belongs to
    const column = columns.find((col) =>
      col.cards.some((card) => card.id === updatedTask.id)
    );

    if (column) {
      updateCard(column.id, updatedTask);
    }

    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const handleCardClick = (card: CardType) => {
    setEditingTask(card);
    setIsEditModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return theme === "dark" ? "bg-green-600" : "bg-green-500";
      case "completed":
        return theme === "dark" ? "bg-blue-600" : "bg-blue-500";
      case "planned":
        return theme === "dark" ? "bg-yellow-600" : "bg-yellow-500";
      default:
        return theme === "dark" ? "bg-gray-600" : "bg-gray-500";
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
  const sidebarBgColor = theme === "dark" ? "dark:bg-gray-800" : "bg-white";
  const sidebarBorderColor =
    theme === "dark" ? "dark:border-gray-700" : "border-gray-200";
  const headerTextColor = theme === "dark" ? "text-white" : "text-gray-900";
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

  // Create a wrapper function for onViewChange that also clears the selected sprint
  // when navigating away from the sprint detail view
  const handleViewChange = (view: string) => {
    // If switching to a different view (not sprints), clear the selected sprint
    if (view !== "sprints") {
      onBack(); // This will clear the selected sprint
    }
    onViewChange(view);
  };

  return (
    <div className="flex-1 flex">
      {/* Top Navigation */}
      <TopNavbar activeView={activeView} onViewChange={handleViewChange} />

      {/* Sidebar Filters */}
      <div
        className={`w-64 ${sidebarBgColor} shadow-lg fixed left-0 top-16 bottom-0 z-40 overflow-y-auto ${sidebarBorderColor} border-r`}
      >
        <div className={`p-4 ${sidebarBorderColor} border-b`}>
          <button
            onClick={onBack}
            className={`flex items-center ${
              theme === "dark"
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back to Sprints
          </button>
          <h1 className={`text-xl font-bold ${headerTextColor} mt-4`}>
            {sprint.name}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                sprint.status
              )} text-white`}
            >
              {getStatusText(sprint.status)}
            </span>
            {sprint.startDate && (
              <span
                className={`text-xs px-2 py-1 rounded ${
                  theme === "dark"
                    ? "bg-green-900 text-green-300"
                    : "bg-green-100 text-green-800"
                }`}
              >
                Start: {new Date(sprint.startDate).toLocaleDateString()}
              </span>
            )}
            {sprint.endDate && (
              <span
                className={`text-xs px-2 py-1 rounded ${
                  theme === "dark"
                    ? "bg-purple-900 text-purple-300"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                End: {new Date(sprint.endDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <h3 className={`text-sm font-medium ${headerTextColor} mb-3`}>
            Filters
          </h3>
          <div className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium ${filterLabelColor} mb-1`}
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-400"
                    }`}
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
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className={`w-full pl-10 pr-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} transition-colors duration-200`}
                  value={localFilters.searchTerm}
                  onChange={(e) =>
                    handleFilterChange("searchTerm", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${filterLabelColor} mb-1`}
              >
                Priority
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    ></path>
                  </svg>
                </div>
                <select
                  className={`w-full pl-10 pr-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${selectBgColor} ${selectBorderColor} ${selectTextColor} transition-colors duration-200`}
                  value={localFilters.priority}
                  onChange={(e) =>
                    handleFilterChange("priority", e.target.value)
                  }
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${filterLabelColor} mb-1`}
              >
                Assignee
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
                <select
                  className={`w-full pl-10 pr-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${selectBgColor} ${selectBorderColor} ${selectTextColor} transition-colors duration-200`}
                  value={localFilters.assignee}
                  onChange={(e) =>
                    handleFilterChange("assignee", e.target.value)
                  }
                >
                  <option value="all">All Assignees</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.name}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${filterLabelColor} mb-1`}
              >
                Module
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    ></path>
                  </svg>
                </div>
                <select
                  className={`w-full pl-10 pr-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${selectBgColor} ${selectBorderColor} ${selectTextColor} transition-colors duration-200`}
                  value={localFilters.module}
                  onChange={(e) => handleFilterChange("module", e.target.value)}
                >
                  <option value="all">All Modules</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="App">App</option>
                </select>
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${filterLabelColor} mb-1`}
              >
                Target
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                    ></path>
                  </svg>
                </div>
                <select
                  className={`w-full pl-10 pr-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${selectBgColor} ${selectBorderColor} ${selectTextColor} transition-colors duration-200`}
                  value={localFilters.target}
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
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-64 pt-16">
        <div
          className={`p-6 ${
            theme === "dark" ? "dark:bg-gray-900" : "bg-gray-50"
          }`}
        >
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {filteredColumns.map((column, index) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Column
                  id={column.id}
                  title={column.title}
                  cards={column.cards}
                  moveCard={moveCard}
                  onCardClick={handleCardClick}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <FloatingActionButton onClick={() => setIsCreateModalOpen(true)} />
        <TaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleAddNewTask}
        />
        <TaskEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          }}
          task={editingTask}
          onSubmit={handleUpdateTask}
        />
      </main>
    </div>
  );
}
