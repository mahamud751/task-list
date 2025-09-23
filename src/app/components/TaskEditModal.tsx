"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDatabase } from "./DatabaseProvider";

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
  figmaLink?: string;
  module?: string;
  target?: string;
  sprintId?: string;
}

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: CardType | null;
  onSubmit: (task: CardType) => void;
}

export default function TaskEditModal({
  isOpen,
  onClose,
  task,
  onSubmit,
}: TaskEditModalProps) {
  const { hasPermission, users } = useDatabase();
  const canEditTask = hasPermission("edit_task");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [storyPoints, setStoryPoints] = useState<number | "">("");
  const [assignee, setAssignee] = useState("");
  const [progress, setProgress] = useState<number | "">("");
  const [timeEstimate, setTimeEstimate] = useState("");
  const [figmaLink, setFigmaLink] = useState("");
  const [module, setModule] = useState("");
  const [target, setTarget] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setStoryPoints(task.storyPoints || "");
      setAssignee(task.assignee || "");
      setProgress(task.progress || "");
      setTimeEstimate(task.timeEstimate || "");
      setFigmaLink(task.figmaLink || "");
      setModule(task.module || "");
      setTarget(task.target || "");
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditTask) {
      alert("You don't have permission to edit tasks");
      return;
    }

    if (task) {
      onSubmit({
        ...task,
        title,
        description,
        priority,
        storyPoints: storyPoints === "" ? undefined : Number(storyPoints),
        assignee: assignee || undefined,
        progress: progress === "" ? undefined : Number(progress),
        timeEstimate: timeEstimate || undefined,
        figmaLink: figmaLink || undefined,
        module: module || undefined,
        target: target || undefined,
      });
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!task || !canEditTask) return null;

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
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Task
                </h2>
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {task.taskId}
                </span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Story Points
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={storyPoints}
                      onChange={(e) =>
                        setStoryPoints(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Assignee
                    </label>
                    <select
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Progress
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={progress}
                      onChange={(e) =>
                        setProgress(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time Estimate
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2d, 3h"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={timeEstimate}
                      onChange={(e) => setTimeEstimate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Figma Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://figma.com/file/..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={figmaLink}
                      onChange={(e) => setFigmaLink(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Module
                    </label>
                    <select
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Target
                    </label>
                    <select
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                    >
                      <option value="">Select Target</option>
                      <option value="Web">Web</option>
                      <option value="Mobile">Mobile</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
