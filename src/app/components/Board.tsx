"use client";

import { useState } from "react";
import { useDatabase } from "./DatabaseProvider";
import Column from "./Column";
import FloatingActionButton from "./FloatingActionButton";
import TaskModal from "./TaskModal";
import SprintCreateModal from "./SprintCreateModal";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function Board() {
  const { columns, addCard, addSprint, sprints } = useDatabase();
  const { theme } = useTheme();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);

  const handleCreateTask = (task: {
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
    // Add task to the first column (To Do)
    if (columns.length > 0) {
      const newCard = {
        id: Date.now().toString(),
        taskId: `TASK-${Date.now()}`,
        ...task,
      };
      addCard(columns[0].id, newCard);
    }
    setIsTaskModalOpen(false);
  };

  const handleCreateSprint = (sprint: {
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }) => {
    addSprint(sprint);
    setIsSprintModalOpen(false);
  };

  // Theme-based colors
  const headerTextColor = theme === "dark" ? "text-white" : "text-gray-900";
  const backgroundColor = theme === "dark" ? "dark:bg-gray-900" : "bg-gray-50";

  return (
    <div className={`p-6 ${backgroundColor}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${headerTextColor}`}>Task Board</h1>
        <button
          onClick={() => setIsSprintModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New Sprint
        </button>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0 w-80"
          >
            <Column id={column.id} title={column.title} cards={column.cards} />
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className={`text-xl font-semibold mb-4 ${headerTextColor}`}>
          Sprints
        </h2>
        {sprints.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sprints.map((sprint) => (
              <div
                key={sprint.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {sprint.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  {sprint.description || "No description"}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                    {sprint.status}
                  </span>
                  {sprint.startDate && sprint.endDate && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(sprint.startDate).toLocaleDateString()} -{" "}
                      {new Date(sprint.endDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">
            No sprints created yet
          </p>
        )}
      </div>

      <FloatingActionButton onClick={() => setIsTaskModalOpen(true)} />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />

      <SprintCreateModal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        onSubmit={handleCreateSprint}
      />
    </div>
  );
}
