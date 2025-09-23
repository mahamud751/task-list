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
import { SprintType } from "../../services/sprintService";

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
  sprint: SprintType;
  onBack: () => void;
  onFilterChange: (filters: FilterOptions) => void;
  filters: FilterOptions;
  activeView: string;
  onViewChange: (view: string) => void;
}) {
  const { columns, moveCard, addCard, updateCard, users } = useDatabase();
  const { theme } = useTheme();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CardType | null>(null);
  const [filteredColumns, setFilteredColumns] = useState(columns);
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync local filters with prop filters when they change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

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
          (card.taskId &&
            card.taskId
              .toLowerCase()
              .includes(localFilters.searchTerm.toLowerCase())) ||
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
  const secondaryTextColor =
    theme === "dark" ? "text-gray-400" : "text-gray-600";
  const inputBgColor = theme === "dark" ? "dark:bg-gray-700" : "bg-white";
  const inputBorderColor =
    theme === "dark" ? "dark:border-gray-600" : "border-gray-300";
  const inputTextColor = theme === "dark" ? "dark:text-white" : "text-gray-900";
  const selectBgColor = theme === "dark" ? "dark:bg-gray-700" : "bg-white";
  const selectBorderColor =
    theme === "dark" ? "dark:border-gray-600" : "border-gray-300";
  const selectTextColor =
    theme === "dark" ? "dark:text-white" : "text-gray-900";
  const placeholderTextColor =
    theme === "dark" ? "dark:placeholder-gray-400" : "placeholder-gray-500";
  const mutedTextColor = theme === "dark" ? "text-gray-500" : "text-gray-500";

  // Create a wrapper function for onViewChange that also clears the selected sprint
  // when navigating away from the sprint detail view
  const handleViewChange = (view: string) => {
    // If switching to a different view (not sprints), clear the selected sprint
    if (view !== "sprints") {
      onBack(); // This will clear the selected sprint
    }
    onViewChange(view);
  };

  // Calculate sprint progress as average of all task progresses
  const calculateSprintProgress = () => {
    const tasksInSprint = columns.flatMap((column) =>
      column.cards.filter((card) => card.sprintId === sprint.id)
    );

    const totalTasks = tasksInSprint.length;
    const totalProgress = tasksInSprint.reduce(
      (sum, task) => sum + (task.progress || 0),
      0
    );

    return totalTasks > 0 ? Math.round(totalProgress / totalTasks) : 0;
  };

  const sprintProgress = calculateSprintProgress();

  return (
    <div className="p-6 animate-fade-in-up">
      {/* Sprint Header */}
      <div className="mb-6 glass-card rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-2xl font-bold ${headerTextColor}`}>
              {sprint.name}
            </h1>
            <p className={`mt-1 ${secondaryTextColor}`}>{sprint.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                sprint.status
              )} text-white`}
            >
              {getStatusText(sprint.status)}
            </span>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Back to Sprints
            </button>
          </div>
        </div>

        {/* Sprint Dates */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {sprint.startDate && (
            <div className="flex items-center">
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
              <span className={secondaryTextColor}>
                Start: {new Date(sprint.startDate).toLocaleDateString()}
              </span>
            </div>
          )}
          {sprint.endDate && (
            <div className="flex items-center">
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
              <span className={secondaryTextColor}>
                End: {new Date(sprint.endDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className={secondaryTextColor}>Progress</span>
            <span className={secondaryTextColor}>
              {sprint.tasks?.length || 0} tasks
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
              style={{ width: `${sprintProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 glass-card rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${filterLabelColor}`}
            >
              Search
            </label>
            <input
              type="text"
              placeholder="Search tasks..."
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} glass-card ${placeholderTextColor}`}
              value={localFilters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${filterLabelColor}`}
            >
              Priority
            </label>
            <select
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${selectBgColor} ${selectBorderColor} ${selectTextColor} glass-card`}
              value={localFilters.priority}
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
              className={`block text-sm font-medium mb-1 ${filterLabelColor}`}
            >
              Assignee
            </label>
            <select
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${selectBgColor} ${selectBorderColor} ${selectTextColor} glass-card`}
              value={localFilters.assignee}
              onChange={(e) => handleFilterChange("assignee", e.target.value)}
            >
              <option value="all">All Assignees</option>
              {users.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${filterLabelColor}`}
            >
              Module
            </label>
            <select
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${selectBgColor} ${selectBorderColor} ${selectTextColor} glass-card`}
              value={localFilters.module}
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
              className={`block text-sm font-medium mb-1 ${filterLabelColor}`}
            >
              Target
            </label>
            <select
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${selectBgColor} ${selectBorderColor} ${selectTextColor} glass-card`}
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

      {/* Kanban Board */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {filteredColumns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            cards={column.cards.map((card) => ({
              ...card,
              taskId: card.taskId || `TASK-${card.id}`, // Ensure taskId is always a string
            }))}
            moveCard={moveCard}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      <FloatingActionButton onClick={() => setIsCreateModalOpen(true)} />

      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleAddNewTask}
      />

      {editingTask && (
        <TaskEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          }}
          onSubmit={handleUpdateTask}
          task={editingTask}
        />
      )}
    </div>
  );
}
