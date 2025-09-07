"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";

interface TaskType {
  id: string;
  taskId?: string;
  title: string;
  description: string;
  priority: string;
  storyPoints?: number;
  assignee?: string;
  progress?: number;
  timeEstimate?: string;
  startDate: string;
  dueDate: string;
  columnId: string;
  module?: string;
  target?: string;
}

export default function TimelineView({ tasks }: { tasks: TaskType[] }) {
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const { theme } = useTheme();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return theme === "dark" ? "bg-red-600" : "bg-red-500";
      case "high":
        return theme === "dark" ? "bg-orange-600" : "bg-orange-500";
      case "medium":
        return theme === "dark" ? "bg-yellow-600" : "bg-yellow-500";
      case "low":
        return theme === "dark" ? "bg-green-600" : "bg-green-500";
      default:
        return theme === "dark" ? "bg-gray-600" : "bg-gray-500";
    }
  };

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case "todo":
        return theme === "dark" ? "bg-gray-700" : "bg-gray-200";
      case "in-progress":
        return theme === "dark" ? "bg-blue-900" : "bg-blue-200";
      case "done":
        return theme === "dark" ? "bg-green-900" : "bg-green-200";
      default:
        return theme === "dark" ? "bg-gray-700" : "bg-gray-200";
    }
  };

  const getColumnLabel = (columnId: string) => {
    switch (columnId) {
      case "todo":
        return "To Do";
      case "in-progress":
        return "In Progress";
      case "done":
        return "Done";
      default:
        return columnId;
    }
  };

  // Theme-based text colors
  const headerTextColor = theme === "dark" ? "text-white" : "text-gray-900";
  const secondaryTextColor =
    theme === "dark" ? "text-gray-300" : "text-gray-500";
  const backgroundColor = theme === "dark" ? "dark:bg-gray-800" : "bg-white";
  const tableHeaderBg = theme === "dark" ? "dark:bg-gray-700" : "bg-gray-50";
  const tableRowHover =
    theme === "dark" ? "dark:hover:bg-gray-700" : "hover:bg-gray-50";
  const dividerColor =
    theme === "dark" ? "dark:divide-gray-700" : "divide-gray-200";
  const progressBarBg = theme === "dark" ? "dark:bg-gray-700" : "bg-gray-200";

  return (
    <div className="p-6">
      {/* Main header */}
      <div className={`${backgroundColor} shadow-sm rounded-lg p-4 mb-6`}>
        <h1 className={`text-2xl font-bold ${headerTextColor}`}>
          Timeline View
        </h1>
        <p className={`mt-1 text-sm ${secondaryTextColor}`}>
          Showing {tasks.length} tasks across all columns
        </p>
      </div>

      <div className={`${backgroundColor} rounded-lg shadow overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y ${dividerColor}`}>
            <thead className={tableHeaderBg}>
              <tr>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}
                >
                  Task
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}
                >
                  Assignee
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}
                >
                  Priority
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}
                >
                  Progress
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}
                >
                  Dates
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className={`${backgroundColor} ${dividerColor}`}>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className={`${tableRowHover} cursor-pointer transition-colors duration-150`}
                  onClick={() => setSelectedTask(task)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full ${
                          theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          {task.title.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div
                          className={`text-sm font-medium ${headerTextColor}`}
                        >
                          {task.taskId
                            ? `${task.taskId}: ${task.title}`
                            : task.title}
                        </div>
                        <div className={`text-sm ${secondaryTextColor}`}>
                          {task.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {task.assignee ? (
                        <>
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {task.assignee.charAt(0).toUpperCase()}
                          </div>
                          <div className={`ml-2 text-sm ${headerTextColor}`}>
                            {task.assignee}
                          </div>
                        </>
                      ) : (
                        <span className={`text-sm ${secondaryTextColor}`}>
                          Unassigned
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(
                        task.priority
                      )} text-white`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {task.progress !== undefined ? (
                      <div>
                        <div
                          className={`flex justify-between text-xs ${secondaryTextColor} mb-1`}
                        >
                          <span>{task.progress}%</span>
                        </div>
                        <div
                          className={`w-full rounded-full h-2 ${progressBarBg}`}
                        >
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <span className={`text-sm ${secondaryTextColor}`}>
                        N/A
                      </span>
                    )}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${secondaryTextColor}`}
                  >
                    <div>Start: {task.startDate}</div>
                    <div>Due: {task.dueDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getColumnColor(
                        task.columnId
                      )} ${theme === "dark" ? "text-white" : "text-gray-800"}`}
                    >
                      {getColumnLabel(task.columnId)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`${backgroundColor} rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${headerTextColor}`}>
                  {selectedTask.taskId
                    ? `${selectedTask.taskId}: ${selectedTask.title}`
                    : selectedTask.title}
                </h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  className={
                    theme === "dark"
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className={`text-lg font-medium ${headerTextColor} mb-2`}>
                    Details
                  </h3>
                  <p
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }
                  >
                    {selectedTask.description}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <span
                        className={`text-sm font-medium ${secondaryTextColor}`}
                      >
                        Priority:
                      </span>
                      <span
                        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(
                          selectedTask.priority
                        )} text-white`}
                      >
                        {selectedTask.priority}
                      </span>
                    </div>

                    <div>
                      <span
                        className={`text-sm font-medium ${secondaryTextColor}`}
                      >
                        Status:
                      </span>
                      <span
                        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getColumnColor(
                          selectedTask.columnId
                        )} ${
                          theme === "dark" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {getColumnLabel(selectedTask.columnId)}
                      </span>
                    </div>

                    {selectedTask.storyPoints && (
                      <div>
                        <span
                          className={`text-sm font-medium ${secondaryTextColor}`}
                        >
                          Story Points:
                        </span>
                        <span className={`ml-2 text-sm ${headerTextColor}`}>
                          {selectedTask.storyPoints}
                        </span>
                      </div>
                    )}

                    {selectedTask.timeEstimate && (
                      <div>
                        <span
                          className={`text-sm font-medium ${secondaryTextColor}`}
                        >
                          Time Estimate:
                        </span>
                        <span className={`ml-2 text-sm ${headerTextColor}`}>
                          {selectedTask.timeEstimate}
                        </span>
                      </div>
                    )}

                    {selectedTask.module && (
                      <div>
                        <span
                          className={`text-sm font-medium ${secondaryTextColor}`}
                        >
                          Module:
                        </span>
                        <span className={`ml-2 text-sm ${headerTextColor}`}>
                          {selectedTask.module}
                        </span>
                      </div>
                    )}

                    {selectedTask.target && (
                      <div>
                        <span
                          className={`text-sm font-medium ${secondaryTextColor}`}
                        >
                          Target:
                        </span>
                        <span className={`ml-2 text-sm ${headerTextColor}`}>
                          {selectedTask.target}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className={`text-lg font-medium ${headerTextColor} mb-2`}>
                    Assignee
                  </h3>
                  {selectedTask.assignee ? (
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                        {selectedTask.assignee.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div
                          className={`text-sm font-medium ${headerTextColor}`}
                        >
                          {selectedTask.assignee}
                        </div>
                        <div className={`text-sm ${secondaryTextColor}`}>
                          Developer
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className={`text-sm ${secondaryTextColor}`}>
                      Unassigned
                    </span>
                  )}

                  <h3
                    className={`text-lg font-medium ${headerTextColor} mt-6 mb-2`}
                  >
                    Dates
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span
                        className={`text-sm font-medium ${secondaryTextColor}`}
                      >
                        Start Date:
                      </span>
                      <span className={`ml-2 text-sm ${headerTextColor}`}>
                        {selectedTask.startDate}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`text-sm font-medium ${secondaryTextColor}`}
                      >
                        Due Date:
                      </span>
                      <span className={`ml-2 text-sm ${headerTextColor}`}>
                        {selectedTask.dueDate}
                      </span>
                    </div>
                  </div>

                  {selectedTask.progress !== undefined && (
                    <>
                      <h3
                        className={`text-lg font-medium ${headerTextColor} mt-6 mb-2`}
                      >
                        Progress
                      </h3>
                      <div>
                        <div
                          className={`flex justify-between text-sm ${secondaryTextColor} mb-1`}
                        >
                          <span>{selectedTask.progress}% Complete</span>
                        </div>
                        <div
                          className={`w-full rounded-full h-3 ${progressBarBg}`}
                        >
                          <div
                            className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${selectedTask.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
