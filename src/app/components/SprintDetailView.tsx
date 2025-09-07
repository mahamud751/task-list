"use client";

import { useState, useEffect } from "react";
import { useDatabase } from "./DatabaseProvider";
import { motion } from "framer-motion";
import Column from "./Column";
import FloatingActionButton from "./FloatingActionButton";
import TaskModal from "./TaskModal";
import TaskEditModal from "./TaskEditModal";

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
}: {
  sprint: any;
  onBack: () => void;
  onFilterChange: (filters: FilterOptions) => void;
  filters: FilterOptions;
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
    <div className="flex-1 flex">
      {/* Sidebar Filters */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg fixed left-0 top-0 bottom-0 z-40 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
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
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
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
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Filters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={localFilters.searchTerm}
                  onChange={(e) =>
                    handleFilterChange("searchTerm", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assignee
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Module
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
      <main className="flex-1 ml-64">
        <header className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-64 right-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {sprint.name}
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg
                  className="w-5 h-5 text-gray-500"
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
              </button>
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                UN
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 pt-20">
          <div className="flex space-x-4 overflow-x-auto">
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
