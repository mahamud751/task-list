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
  order?: number;
}

interface ColumnProps {
  id: string;
  title: string;
  cards: CardType[];
  moveCard?: (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    newPosition?: number
  ) => void;
  onCardClick?: (card: CardType) => void;
}

// Drop zone component for reordering within column
const DropZone = ({
  position,
  onDrop,
  columnId,
}: {
  position: number;
  onDrop: (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    newPosition: number
  ) => void;
  columnId: string;
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "card",
    drop: (item: { id: string; columnId: string }) => {
      onDrop(item.id, item.columnId, columnId, position);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dropRef.current) {
      try {
        drop(dropRef.current);
      } catch (e) {
        // Ignore React DnD ref handling errors
        console.debug("React DnD ref handling error:", e);
      }
    }
  }, [drop]);

  return (
    <div
      ref={dropRef}
      className={`h-3 w-full rounded-lg transition-all duration-200 mx-auto my-1 ${
        isOver
          ? "bg-indigo-500 h-6 shadow-lg transform scale-105"
          : "bg-indigo-200/50 hover:bg-indigo-300/50"
      }`}
    >
      {isOver && (
        <div className="flex items-center justify-center h-full">
          <div className="w-4 h-4 rounded-full bg-white"></div>
        </div>
      )}
    </div>
  );
};

export default function Column({
  id,
  title,
  cards,
  moveCard,
  onCardClick,
}: ColumnProps) {
  const { hasPermission, updateCard } = useDatabase();
  const canDrop = hasPermission("move_task");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CardType | null>(null);
  const columnRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "card",
    drop: (item: { id: string; columnId: string }) => {
      // Handle drops from different columns or same column
      if (moveCard) {
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
      try {
        dropRef(columnRef.current);
      } catch (e) {
        // Ignore React DnD ref handling errors
        console.debug("React DnD ref handling error:", e);
      }
    }
  }, [dropRef, canDrop]);

  const handleCardClick = (card: CardType) => {
    // Check if user has permission to edit tasks
    if (hasPermission("edit_task")) {
      setEditingTask(card);
      setIsEditModalOpen(true);
    } else {
      console.log("Card clicked:", card);
      if (onCardClick) {
        onCardClick(card);
      }
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

  const handleMoveCard = (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    newPosition: number
  ) => {
    if (moveCard) {
      moveCard(cardId, fromColumnId, toColumnId, newPosition);
    }
  };

  // Calculate priority counts for the header
  const priorityCounts = {
    critical: cards.filter((card) => card.priority === "critical").length,
    high: cards.filter((card) => card.priority === "high").length,
    medium: cards.filter((card) => card.priority === "medium").length,
    low: cards.filter((card) => card.priority === "low").length,
  };

  // Sort cards by order
  const sortedCards = [...cards].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  return (
    <div
      ref={columnRef}
      className={`bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 w-80 md:w-96 lg:w-[32rem] transition-all duration-300 shadow-lg ${
        isOver && canDrop
          ? "ring-4 ring-indigo-500 bg-gradient-to-b from-indigo-50 to-gray-100 dark:from-indigo-900/30 dark:to-gray-800 scale-[1.02]"
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
      <div className="min-h-[100px]">
        {/* Drop zone at the top of the column */}
        <DropZone position={0} onDrop={handleMoveCard} columnId={id} />

        {sortedCards.map((card, index) => (
          <div key={card.id}>
            <motion.div
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
            {/* Drop zone between cards */}
            <DropZone
              position={index + 1}
              onDrop={handleMoveCard}
              columnId={id}
            />
          </div>
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
