"use client";

import { useState, useEffect, createContext, useContext } from "react";

interface CardType {
  id: string;
  title: string;
  description: string;
  priority: string;
  storyPoints?: number;
  assignee?: string;
  progress?: number;
  timeEstimate?: string;
}

interface ColumnType {
  id: string;
  title: string;
  cards: CardType[];
}

interface DataContextType {
  columns: ColumnType[];
  setColumns: (columns: ColumnType[]) => void;
  addColumn: (column: ColumnType) => void;
  updateColumn: (column: ColumnType) => void;
  deleteColumn: (columnId: string) => void;
  addCard: (columnId: string, card: CardType) => void;
  updateCard: (columnId: string, card: CardType) => void;
  deleteCard: (columnId: string, cardId: string) => void;
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_COLUMNS: ColumnType[] = [
  {
    id: "todo",
    title: "To Do",
    cards: [
      {
        id: "1",
        title: "Implement drag and drop",
        description: "Create components with drag and drop functionality",
        priority: "high",
        storyPoints: 5,
        assignee: "Alex",
        timeEstimate: "2d",
      },
      {
        id: "2",
        title: "Add animations",
        description: "Implement smooth animations for card movements",
        priority: "medium",
        storyPoints: 3,
        assignee: "Sam",
        timeEstimate: "1d",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    cards: [
      {
        id: "3",
        title: "Design UI",
        description: "Create a beautiful UI with Tailwind CSS",
        priority: "critical",
        storyPoints: 8,
        assignee: "Jordan",
        progress: 65,
        timeEstimate: "3d",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    cards: [
      {
        id: "4",
        title: "Project setup",
        description: "Initialize Next.js project with Tailwind CSS",
        priority: "low",
        storyPoints: 2,
        assignee: "Taylor",
        progress: 100,
        timeEstimate: "1d",
      },
    ],
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [columns, setColumns] = useState<ColumnType[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("jiraCloneData");
    if (savedData) {
      try {
        setColumns(JSON.parse(savedData));
      } catch (error) {
        console.error("Failed to parse saved data:", error);
        setColumns(DEFAULT_COLUMNS);
      }
    } else {
      setColumns(DEFAULT_COLUMNS);
    }
  }, []);

  // Save data to localStorage whenever columns change
  useEffect(() => {
    localStorage.setItem("jiraCloneData", JSON.stringify(columns));
  }, [columns]);

  const addColumn = (column: ColumnType) => {
    setColumns((prev) => [...prev, column]);
  };

  const updateColumn = (updatedColumn: ColumnType) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === updatedColumn.id ? updatedColumn : column
      )
    );
  };

  const deleteColumn = (columnId: string) => {
    setColumns((prev) => prev.filter((column) => column.id !== columnId));
  };

  const addCard = (columnId: string, card: CardType) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? { ...column, cards: [...column.cards, card] }
          : column
      )
    );
  };

  const updateCard = (columnId: string, updatedCard: CardType) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: column.cards.map((card) =>
                card.id === updatedCard.id ? updatedCard : card
              ),
            }
          : column
      )
    );
  };

  const deleteCard = (columnId: string, cardId: string) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: column.cards.filter((card) => card.id !== cardId),
            }
          : column
      )
    );
  };

  const moveCard = (
    cardId: string,
    fromColumnId: string,
    toColumnId: string
  ) => {
    setColumns((prev) => {
      const newColumns = [...prev];

      // Find the card and its source column
      const fromColumnIndex = newColumns.findIndex(
        (column) => column.id === fromColumnId
      );
      const fromColumn = newColumns[fromColumnIndex];
      const cardIndex = fromColumn.cards.findIndex(
        (card) => card.id === cardId
      );
      const card = fromColumn.cards[cardIndex];

      // Remove card from source column
      const newFromCards = [...fromColumn.cards];
      newFromCards.splice(cardIndex, 1);

      // Update source column
      newColumns[fromColumnIndex] = {
        ...fromColumn,
        cards: newFromCards,
      };

      // Add card to target column
      const toColumnIndex = newColumns.findIndex(
        (column) => column.id === toColumnId
      );
      const toColumn = newColumns[toColumnIndex];
      const newToCards = [...toColumn.cards, card];

      // Update target column
      newColumns[toColumnIndex] = {
        ...toColumn,
        cards: newToCards,
      };

      return newColumns;
    });
  };

  return (
    <DataContext.Provider
      value={{
        columns,
        setColumns,
        addColumn,
        updateColumn,
        deleteColumn,
        addCard,
        updateCard,
        deleteCard,
        moveCard,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
