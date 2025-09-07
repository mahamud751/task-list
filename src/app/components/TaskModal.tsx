"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDatabase } from "./DatabaseProvider";
import { useTheme } from "./ThemeProvider";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    description: string;
    priority: string;
    storyPoints?: number;
    assignee?: string;
    timeEstimate?: string;
    module?: string;
    target?: string;
  }) => void;
  onTaskCreated?: () => void; // Add this callback
}

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  onTaskCreated,
}: TaskModalProps) {
  const { hasPermission, users } = useDatabase();
  const { theme } = useTheme();
  const canCreateTask = hasPermission("create_task");

  // Theme-based colors
  const backgroundColor = theme === "dark" ? "dark:bg-gray-800" : "bg-white";
  const textColor = theme === "dark" ? "dark:text-white" : "text-gray-900";
  const secondaryTextColor =
    theme === "dark" ? "dark:text-gray-300" : "text-gray-700";
  const inputBgColor = theme === "dark" ? "dark:bg-gray-700" : "";
  const inputBorderColor =
    theme === "dark" ? "dark:border-gray-600" : "border-gray-300";
  const inputTextColor = theme === "dark" ? "dark:text-white" : "";
  const dividerColor =
    theme === "dark" ? "dark:border-gray-700" : "border-gray-200";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [storyPoints, setStoryPoints] = useState<number | "">("");
  const [assignee, setAssignee] = useState("");
  const [timeEstimate, setTimeEstimate] = useState("");
  const [module, setModule] = useState(""); // Will be a dropdown
  const [target, setTarget] = useState(""); // Will be a dropdown

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateTask) {
      alert("You don't have permission to create tasks");
      return;
    }

    onSubmit({
      title,
      description,
      priority,
      storyPoints: storyPoints === "" ? undefined : Number(storyPoints),
      assignee: assignee || undefined,
      timeEstimate: timeEstimate || undefined,
      module: module || undefined,
      target: target || undefined,
    });

    // Call the callback to notify parent component
    if (onTaskCreated) {
      onTaskCreated();
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStoryPoints("");
    setAssignee("");
    setTimeEstimate("");
    setModule("");
    setTarget("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!canCreateTask) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className={`rounded-xl shadow-2xl w-full max-w-md ${backgroundColor} border ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`px-6 py-4 border-b ${dividerColor} flex justify-between items-center`}
            >
              <h2 className={`text-xl font-bold ${textColor}`}>
                Create New Task
              </h2>
              <button
                onClick={handleClose}
                className={`p-1 rounded-full ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} transition-all duration-200`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                  >
                    Description
                  </label>
                  <textarea
                    className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} transition-all duration-200`}
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                    >
                      Priority
                    </label>
                    <select
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} transition-all duration-200`}
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                    >
                      Story Points
                    </label>
                    <input
                      type="number"
                      min="1"
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} transition-all duration-200`}
                      value={storyPoints}
                      onChange={(e) =>
                        setStoryPoints(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }
                      placeholder="Points"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                    >
                      Assignee
                    </label>
                    <select
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} transition-all duration-200`}
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.name}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                    >
                      Time Estimate
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} transition-all duration-200`}
                      value={timeEstimate}
                      onChange={(e) => setTimeEstimate(e.target.value)}
                      placeholder="e.g., 2h 30m"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                    >
                      Module
                    </label>
                    <select
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} transition-all duration-200`}
                      value={module}
                      onChange={(e) => setModule(e.target.value)}
                    >
                      <option value="">Select Module</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="App">App</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                    >
                      Target
                    </label>
                    <select
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} transition-all duration-200`}
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                    >
                      <option value="">Select Target</option>
                      <option value="Web">Web</option>
                      <option value="Mobile">Mobile</option>
                    </select>
                  </div>
                </div>

                {/* Removed the Image URL input field */}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-gray-600 text-white hover:bg-gray-700"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
