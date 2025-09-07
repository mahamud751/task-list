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
}

interface FilterOptions {
  searchTerm: string;
  priority: string;
  assignee: string;
  module: string;
  target: string;
}

export default function Board({ filters }: { filters: FilterOptions }) {
  const { columns, addCard, updateCard, moveCard, loading, error } =
    useDatabase();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CardType | null>(null);
  const [filteredColumns, setFilteredColumns] = useState(columns);

  // Apply filters whenever columns or filters change
  useEffect(() => {
    const filtered = columns.map((column) => {
      const filteredCards = column.cards.filter((card) => {
        // Search term filter
        const matchesSearch =
          filters.searchTerm === "" ||
          card.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          (card.description &&
            card.description
              .toLowerCase()
              .includes(filters.searchTerm.toLowerCase())) ||
          (card.taskId &&
            card.taskId
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
  }, [columns, filters]);

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
    // Add to the first column (To Do)
    if (columns.length > 0) {
      addCard(columns[0].id, task);
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
        <div className="text-lg">Loading board data...</div>
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

  return (
    <div className="flex space-x-4 p-6 overflow-x-auto pt-20">
      <motion.div
        className="flex space-x-4"
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
