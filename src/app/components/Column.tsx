"use client";

import { useState, useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import { motion } from "framer-motion";
import Card from "./Card";
import { useDatabase } from "./DatabaseProvider";
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

interface ColumnProps {
  id: string;
  title: string;
  cards: CardType[];
}

export default function Column({ id, title, cards }: ColumnProps) {
  const { moveCard, hasPermission, updateCard } = useDatabase();
  const canDrop = hasPermission("move_task");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CardType | null>(null);
  const columnRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "card",
    drop: (item: { id: string; columnId: string }) => {
      if (item.columnId !== id) {
        moveCard(item.id, item.columnId, id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    canDrop: () => canDrop, // Only allow dropping if user has permission
  }));

  // Attach the drop ref to our columnRef
  useEffect(() => {
    if (columnRef.current) {
      drop(columnRef.current);
    }
  }, [drop, canDrop]);

  const handleCardClick = (card: CardType) => {
    // Check if user has permission to edit tasks
    if (hasPermission("edit_task")) {
      setEditingTask(card);
      setIsEditModalOpen(true);
    } else {
      console.log("Card clicked:", card);
    }
  };

  const handleUpdateTask = (updatedTask: CardType) => {
    // Update the task using the database context
    updateCard(id, updatedTask);
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  // Calculate priority counts for the header
  const priorityCounts = {
    critical: cards.filter((card) => card.priority === "critical").length,
    high: cards.filter((card) => card.priority === "high").length,
    medium: cards.filter((card) => card.priority === "medium").length,
    low: cards.filter((card) => card.priority === "low").length,
  };

  return (
    <div
      ref={columnRef}
      className={`bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 w-80 transition-all duration-300 shadow-lg ${
        isOver && canDrop
          ? "ring-2 ring-indigo-500 bg-gradient-to-b from-indigo-50 to-gray-100 dark:from-indigo-900/30 dark:to-gray-800"
          : ""
      } ${!canDrop ? "opacity-75" : ""}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-gray-800 dark:text-white flex items-center">
          <span>{title}</span>
          <motion.span
            className="ml-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-normal px-2 py-1 rounded-full shadow"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            {cards.length}
          </motion.span>
        </h2>
        <div className="flex space-x-1">
          {priorityCounts.critical > 0 && (
            <span
              className="w-3 h-3 rounded-full bg-red-500 shadow-sm"
              title={`${priorityCounts.critical} critical tasks`}
            ></span>
          )}
          {priorityCounts.high > 0 && (
            <span
              className="w-3 h-3 rounded-full bg-orange-500 shadow-sm"
              title={`${priorityCounts.high} high priority tasks`}
            ></span>
          )}
          {priorityCounts.medium > 0 && (
            <span
              className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"
              title={`${priorityCounts.medium} medium priority tasks`}
            ></span>
          )}
          {priorityCounts.low > 0 && (
            <span
              className="w-3 h-3 rounded-full bg-green-500 shadow-sm"
              title={`${priorityCounts.low} low priority tasks`}
            ></span>
          )}
        </div>
      </div>
      <div className="min-h-[100px] space-y-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="cursor-pointer"
          >
            <Card
              id={card.id}
              taskId={card.taskId || `TASK-${card.id}`}
              columnId={id}
              title={card.title}
              description={card.description}
              priority={card.priority}
              storyPoints={card.storyPoints}
              assignee={card.assignee}
              progress={card.progress}
              timeEstimate={card.timeEstimate}
              module={card.module}
              target={card.target}
              imageUrl={card.imageUrl}
              onClick={() => handleCardClick(card)}
            />
          </motion.div>
        ))}
      </div>
      <TaskEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        task={editingTask}
        onSubmit={handleUpdateTask}
      />
    </div>
  );
}
