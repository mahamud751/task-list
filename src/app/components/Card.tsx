"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useDrag } from "react-dnd";
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
  figmaLink?: string;
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
  figmaLink,
  module,
  target,
  onClick,
}: CardProps) {
  const { hasPermission } = useDatabase();
  const canDrag = hasPermission("move_task");
  const cardRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "card",
    item: { id, columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => canDrag, // Only allow dragging if user has permission
  }));

  // Connect drag ref to the card ref
  if (canDrag) {
    drag(cardRef);
  }

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

  const getPriorityGlow = (priority: string) => {
    switch (priority) {
      case "critical":
        return "shadow-[0_0_15px_rgba(239,68,68,0.3)]";
      case "high":
        return "shadow-[0_0_15px_rgba(249,115,22,0.3)]";
      case "medium":
        return "shadow-[0_0_15px_rgba(234,179,8,0.3)]";
      case "low":
        return "shadow-[0_0_15px_rgba(34,197,94,0.3)]";
      default:
        return "";
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-3 transition-all duration-300 transform card-hover border-l-4 ${
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
          ? "cursor-move hover:cursor-pointer hover:shadow-xl"
          : "cursor-default"
      } ${getPriorityGlow(priority)} ${
        isDragging ? "ring-2 ring-indigo-500 scale-105 z-50" : ""
      }`}
      whileHover={
        canDrag
          ? {
              y: -5,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }
          : {}
      }
      whileTap={canDrag ? { scale: 0.98 } : {}}
      animate={{
        opacity: isDragging ? 0.8 : 1,
        scale: isDragging ? 1.05 : 1,
        rotate: isDragging ? 0 : 0,
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start">
        <div className="min-w-0 flex-1">
          {" "}
          {/* Added min-w-0 and flex-1 to handle text overflow */}
          <div className="flex items-center">
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0">
              {taskId}
            </span>
            <h3 className="font-semibold text-gray-800 dark:text-white truncate">
              {" "}
              {/* Added truncate */}
              {title}
            </h3>
          </div>
          {(module || target) && (
            <div className="flex flex-wrap gap-1 mt-2">
              {module && (
                <span className="text-xs px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full dark:from-blue-900 dark:to-indigo-900 dark:text-blue-300 whitespace-nowrap">
                  {module}
                </span>
              )}
              {target && (
                <span className="text-xs px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full dark:from-purple-900 dark:to-pink-900 dark:text-purple-300 whitespace-nowrap">
                  {target}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
          {" "}
          {/* Added ml-2 and flex-shrink-0 */}
          {storyPoints && (
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow whitespace-nowrap">
              {storyPoints} pts
            </span>
          )}
          <span
            className={`w-3 h-3 rounded-full ${getPriorityColor(
              priority
            )} shadow-sm flex-shrink-0`}
          ></span>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 mt-2">
        {description}
      </p>

      {progress !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            ></motion.div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex space-x-2">
          {assignee ? (
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                {assignee.charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-full w-7 h-7 dark:bg-gray-700 flex-shrink-0" />
          )}
        </div>

        <div className="flex space-x-3">
          {timeEstimate && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <svg
                className="w-4 h-4 mr-1 flex-shrink-0"
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
              <span className="truncate max-w-[60px]">{timeEstimate}</span>{" "}
              {/* Added truncate with max-width */}
            </div>
          )}
          {figmaLink && (
            <a
              href={figmaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                className="w-4 h-4 mr-1 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>Figma</span>
            </a>
          )}
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <svg
              className="w-4 h-4 mr-1 flex-shrink-0"
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
