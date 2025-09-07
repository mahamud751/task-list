"use client";

import { useDrag } from "react-dnd";
import { motion } from "framer-motion";
import { useDatabase } from "./DatabaseProvider";

interface CardProps {
  id: string;
  taskId: string;
  columnId: string;
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
  onClick: () => void;
}

export default function Card({
  id,
  taskId,
  columnId,
  title,
  description,
  priority,
  storyPoints,
  assignee,
  progress,
  timeEstimate,
  module,
  target,
  imageUrl,
  onClick,
}: CardProps) {
  const { hasPermission } = useDatabase();
  const canDrag = hasPermission("move_task");

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "card",
    item: { id, columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => canDrag, // Only allow dragging if user has permission
  }));

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

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-700 dark:text-red-300";
      case "high":
        return "text-orange-700 dark:text-orange-300";
      case "medium":
        return "text-yellow-700 dark:text-yellow-300";
      case "low":
        return "text-green-700 dark:text-green-300";
      default:
        return "text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <motion.div
      ref={canDrag ? drag : null} // Only attach drag ref if user can drag
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-3 transition-all duration-300 transform card-hover border-l-4 ${
        priority === "critical"
          ? "border-red-500"
          : priority === "high"
          ? "border-orange-500"
          : priority === "medium"
          ? "border-yellow-500"
          : priority === "low"
          ? "border-green-500"
          : "border-gray-500"
      } ${
        canDrag
          ? "cursor-move hover:cursor-pointer hover:shadow-lg"
          : "cursor-default"
      }`}
      whileHover={canDrag ? { y: -2 } : {}}
      whileTap={canDrag ? { scale: 0.98 } : {}}
      animate={{
        opacity: isDragging ? 0.5 : 1,
        scale: isDragging ? 0.95 : 1,
        rotate: isDragging ? 2 : 0,
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mr-2">
              {taskId}
            </span>
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {title}
            </h3>
          </div>
          {(module || target) && (
            <div className="flex flex-wrap gap-1 mt-1">
              {module && (
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-300">
                  {module}
                </span>
              )}
              {target && (
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full dark:bg-purple-900 dark:text-purple-300">
                  {target}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {storyPoints && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
              {storyPoints} pts
            </span>
          )}
          <span
            className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`}
          ></span>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
        {description}
      </p>

      {imageUrl && (
        <div className="mb-3 rounded-md overflow-hidden">
          <img
            src={imageUrl}
            alt="Task attachment"
            className="w-full h-24 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>
      )}

      {progress !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            ></motion.div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {assignee ? (
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {assignee.charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-full w-6 h-6" />
          )}
        </div>

        <div className="flex space-x-3">
          {timeEstimate && (
            <div className="flex items-center text-xs text-gray-500">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>{timeEstimate}</span>
            </div>
          )}
          <div className="flex items-center text-xs text-gray-500">
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
            <span>2d</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
