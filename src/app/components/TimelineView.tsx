"use client";

import { useState } from "react";

interface TaskType {
  id: string;
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
}

export default function TimelineView({ tasks }: { tasks: TaskType[] }) {
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case "todo":
        return "bg-gray-200 dark:bg-gray-700";
      case "in-progress":
        return "bg-blue-200 dark:bg-blue-900";
      case "done":
        return "bg-green-200 dark:bg-green-900";
      default:
        return "bg-gray-200 dark:bg-gray-700";
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

  return (
    <div className="p-6 pt-20">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Timeline View
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Task
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Assignee
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Priority
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Progress
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Dates
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {task.title.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
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
                          <div className="ml-2 text-sm text-gray-900 dark:text-white">
                            {task.assignee}
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
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
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        N/A
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div>Start: {task.startDate}</div>
                    <div>Due: {task.dueDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getColumnColor(
                        task.columnId
                      )} text-gray-800 dark:text-white`}
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedTask.title}
                </h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Details
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {selectedTask.description}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
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
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status:
                      </span>
                      <span
                        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getColumnColor(
                          selectedTask.columnId
                        )} text-gray-800 dark:text-white`}
                      >
                        {getColumnLabel(selectedTask.columnId)}
                      </span>
                    </div>

                    {selectedTask.storyPoints && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Story Points:
                        </span>
                        <span className="ml-2 text-sm text-gray-900 dark:text-white">
                          {selectedTask.storyPoints}
                        </span>
                      </div>
                    )}

                    {selectedTask.timeEstimate && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Time Estimate:
                        </span>
                        <span className="ml-2 text-sm text-gray-900 dark:text-white">
                          {selectedTask.timeEstimate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Assignee
                  </h3>
                  {selectedTask.assignee ? (
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                        {selectedTask.assignee.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedTask.assignee}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Developer
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Unassigned
                    </span>
                  )}

                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6 mb-2">
                    Dates
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Start Date:
                      </span>
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">
                        {selectedTask.startDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Due Date:
                      </span>
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">
                        {selectedTask.dueDate}
                      </span>
                    </div>
                  </div>

                  {selectedTask.progress !== undefined && (
                    <>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6 mb-2">
                        Progress
                      </h3>
                      <div>
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <span>{selectedTask.progress}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                          <div
                            className="bg-blue-600 h-3 rounded-full"
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
