"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

interface SprintCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sprint: {
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }) => void;
}

export default function SprintCreateModal({
  isOpen,
  onClose,
  onSubmit,
}: SprintCreateModalProps) {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("planned");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description: description || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status,
    });
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setStatus("planned");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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
            className={`rounded-lg shadow-xl w-full max-w-md ${backgroundColor}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`px-6 py-4 border-b ${dividerColor}`}>
              <h2 className={`text-xl font-bold ${textColor}`}>
                Create New Sprint
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                  >
                    Sprint Name
                  </label>
                  <input
                    type="text"
                    required
                    className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sprint name"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                  >
                    Description
                  </label>
                  <textarea
                    className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor}`}
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Sprint description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor}`}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor}`}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                  >
                    Status
                  </label>
                  <select
                    className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor}`}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    theme === "dark"
                      ? "bg-gray-600 text-white hover:bg-gray-700"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                >
                  Create Sprint
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
