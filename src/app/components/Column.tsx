"use client";

import { useDrop } from "react-dnd";
import { motion } from "framer-motion";
import Card from "./Card";
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
  module?: string;
  target?: string;
  imageUrl?: string;
}

interface ColumnProps {
  id: string;
  title: string;
  cards: CardType[];
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string) => void;
  onCardClick: (card: CardType) => void;
}

export default function Column({
  id,
  title,
  cards,
  moveCard,
  onCardClick,
}: ColumnProps) {
  const { hasPermission } = useDatabase();
  const canDrop = hasPermission("move_task");

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

  return (
    <motion.div
      ref={canDrop ? drop : null} // Only attach drop ref if user can drop
      className={`bg-gray-100 dark:bg-gray-700 rounded-lg p-4 w-80 transition-all duration-300 ${
        isOver && canDrop ? "bg-gray-200 dark:bg-gray-600 shadow-inner" : ""
      } ${!canDrop ? "opacity-75" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-bold text-lg text-gray-800 dark:text-white mb-4 flex items-center">
        <span>{title}</span>
        <motion.span
          className="ml-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-normal px-2 py-1 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {cards.length}
        </motion.span>
      </h2>
      <div className="min-h-[100px] space-y-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              id={card.id}
              taskId={card.taskId}
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
              onClick={() => onCardClick(card)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
