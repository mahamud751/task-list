"use client";

import { useState, useEffect } from "react";
import { useDatabase } from "./DatabaseProvider";
import { motion } from "framer-motion";
import Column from "./Column";
import FloatingActionButton from "./FloatingActionButton";
import TaskModal from "./TaskModal";
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

interface FilterOptions {
  searchTerm: string;
  priority: string;
  assignee: string;
  module: string;
  target: string;
}

export default function SprintView({ filters }: { filters: FilterOptions }) {
  const {
    columns,
    currentSprint,
    moveCard,
    addCard,
    updateCard,
    loading,
    error,
  } = useDatabase();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CardType | null>(null);
  const [filteredColumns, setFilteredColumns] = useState(columns);

  // Apply filters whenever columns or filters change
  useEffect(() => {
    if (!currentSprint) {
      setFilteredColumns([]);
      return;
    }

    const filtered = columns.map((column) => {
      const filteredCards = column.cards.filter((card) => {
        // Check if card belongs to current sprint
        if (card.sprintId !== currentSprint.id) {
          return false;
        }

        // Search term filter
        const matchesSearch =
          filters.searchTerm === "" ||
          card.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          card.taskId
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          (card.description &&
            card.description
              .toLowerCase()
              .includes(filters.searchTerm.toLowerCase()));

        // Priority filter
        const matchesPriority =
          filters.priority === "all" || card.priority === filters.priority;

        // Assignee filter
        const matchesAssignee =
          filters.assignee === "all" ||
          (card.assignee &&
            card.assignee
              .toLowerCase()
              .includes(filters.assignee.toLowerCase()));

        // Module filter
        const matchesModule =
          filters.module === "all" ||
          (card.module &&
            card.module.toLowerCase().includes(filters.module.toLowerCase()));

        // Target filter
        const matchesTarget =
          filters.target === "all" ||
          (card.target &&
            card.target.toLowerCase().includes(filters.target.toLowerCase()));

        return (
          matchesSearch &&
          matchesPriority &&
          matchesAssignee &&
          matchesModule &&
          matchesTarget
        );
      });

      return {
        ...column,
        cards: filteredCards,
      };
    });

    setFilteredColumns(filtered);
  }, [columns, currentSprint, filters]);

  const handleAddNewTask = (task: {
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
    // Add to the first column (To Do) and current sprint
    if (columns.length > 0 && currentSprint) {
      addCard(columns[0].id, {
        ...task,
        sprintId: currentSprint.id,
      });
    }
    setIsCreateModalOpen(false);
  };

  const handleUpdateTask = (updatedTask: CardType) => {
    // Find which column the task belongs to
    const column = columns.find((col) =>
      col.cards.some((card) => card.id === updatedTask.id)
    );

    if (column) {
      updateCard(column.id, updatedTask);
    }

    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const handleCardClick = (card: CardType) => {
    setEditingTask(card);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full pt-20">
        <div className="text-lg">Loading sprint data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full pt-20">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!currentSprint) {
    return (
      <div className="flex justify-center items-center h-full pt-20">
        <div className="text-lg">No sprint selected</div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-20">
      <div className="mb-6">
        <motion.h1
          className="text-2xl font-bold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentSprint.name}
        </motion.h1>
        {currentSprint.description && (
          <motion.p
            className="text-gray-600 dark:text-gray-400 mt-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {currentSprint.description}
          </motion.p>
        )}
        <div className="flex flex-wrap gap-2 mt-4">
          <motion.span
            className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            Status: {currentSprint.status}
          </motion.span>
          {currentSprint.startDate && (
            <motion.span
              className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-green-900 dark:text-green-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              Start: {new Date(currentSprint.startDate).toLocaleDateString()}
            </motion.span>
          )}
          {currentSprint.endDate && (
            <motion.span
              className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-purple-900 dark:text-purple-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              End: {new Date(currentSprint.endDate).toLocaleDateString()}
            </motion.span>
          )}
        </div>
      </div>

      <motion.div
        className="flex space-x-4 overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredColumns.map((column, index) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Column
              id={column.id}
              title={column.title}
              cards={column.cards}
              moveCard={moveCard}
              onCardClick={handleCardClick}
            />
          </motion.div>
        ))}
      </motion.div>

      <FloatingActionButton onClick={() => setIsCreateModalOpen(true)} />
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleAddNewTask}
      />
      <TaskEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSubmit={handleUpdateTask}
      />
    </div>
  );
}
