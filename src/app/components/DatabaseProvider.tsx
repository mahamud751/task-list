"use client";

import { useState, useEffect, createContext, useContext } from "react";
import * as api from "../../lib/api";
import { ColumnType } from "./DataProvider";
import { userService, User } from "../../services/userService";

// Define CardType with all necessary fields for database operations
interface CardType {
  id: string;
  taskId?: string;
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

interface DataContextType {
  columns: ColumnType[];
  sprints: any[];
  currentSprint: any | null;
  loading: boolean;
  error: string | null;
  currentUser: User | null;
  users: User[];
  refreshData: () => Promise<void>;
  addColumn: (title: string) => Promise<void>;
  updateColumn: (id: string, title: string) => Promise<void>;
  deleteColumn: (id: string) => Promise<void>;
  addCard: (columnId: string, card: Omit<CardType, "id">) => Promise<void>;
  updateCard: (columnId: string, card: CardType) => Promise<void>;
  deleteCard: (columnId: string, cardId: string) => Promise<void>;
  moveCard: (
    cardId: string,
    fromColumnId: string,
    toColumnId: string
  ) => Promise<void>;
  // Sprint functions
  refreshSprints: () => Promise<void>;
  setCurrentSprint: (sprint: any | null) => void;
  addSprint: (sprint: any) => Promise<void>;
  updateSprint: (id: string, sprint: any) => Promise<void>;
  deleteSprint: (id: string) => Promise<void>;
  // User functions
  setCurrentUser: (user: User | null) => void;
  refreshUsers: () => Promise<void>;
  createUser: (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => Promise<void>;
  updateUser: (
    id: string,
    userData: { name?: string; email?: string; role?: string }
  ) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  hasPermission: (action: string) => boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
}

const DatabaseContext = createContext<DataContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [sprints, setSprints] = useState<any[]>([]);
  const [currentSprint, setCurrentSprint] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem("currentUser");
      }
    }

    // Load data on mount
    refreshData();
    refreshSprints();
    refreshUsers();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const refreshData = async () => {
    try {
      setLoading(true);
      const data = await api.fetchColumns();

      // Transform API data to match frontend types
      const transformedData = data.map((column: any) => ({
        id: column.id,
        title: column.title,
        cards: column.tasks.map((task: any) => ({
          id: task.id,
          taskId: task.taskId,
          title: task.title,
          description: task.description || "",
          priority: task.priority,
          storyPoints: task.storyPoints || undefined,
          assignee: task.assignee?.name || undefined,
          progress: task.progress,
          timeEstimate: task.timeEstimate || undefined,
          module: task.module || undefined,
          target: task.target || undefined,
          imageUrl: task.imageUrl || undefined,
          sprintId: task.sprintId || undefined,
        })),
      })) as ColumnType[];

      setColumns(transformedData);
      setError(null);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data from database");
    } finally {
      setLoading(false);
    }
  };

  const refreshSprints = async () => {
    try {
      const data = await fetch("/api/sprints").then((res) => res.json());
      setSprints(data);
    } catch (err) {
      console.error("Error loading sprints:", err);
      setError("Failed to load sprints from database");
    }
  };

  const refreshUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const userData = await response.json();
      setUsers(userData);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Failed to load users from database");
    }
  };

  const addColumn = async (title: string) => {
    try {
      const maxOrder =
        columns.length > 0
          ? Math.max(
              ...columns.map((c) =>
                c.id === "order" ? 0 : parseInt(c.id) || 0
              )
            )
          : 0;

      await api.createColumn(title, maxOrder + 1);
      await refreshData();
    } catch (err) {
      console.error("Error adding column:", err);
      setError("Failed to add column");
    }
  };

  const updateColumn = async (id: string, title: string) => {
    try {
      const response = await fetch(`/api/columns`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          title,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update column");
      }

      await refreshData();
    } catch (err) {
      console.error("Error updating column:", err);
      setError("Failed to update column");
    }
  };

  const deleteColumn = async (id: string) => {
    try {
      const response = await fetch(`/api/columns?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete column");
      }

      await refreshData();
    } catch (err) {
      console.error("Error deleting column:", err);
      setError("Failed to delete column");
    }
  };

  const addCard = async (columnId: string, card: Omit<CardType, "id">) => {
    try {
      // Find the assignee ID from the users list
      let assigneeId = undefined;
      if (card.assignee) {
        const assigneeUser = users.find((user) => user.name === card.assignee);
        if (assigneeUser) {
          assigneeId = assigneeUser.id;
        }
      }

      await api.createTask({
        title: card.title,
        description: card.description,
        priority: card.priority,
        storyPoints: card.storyPoints,
        progress: card.progress,
        timeEstimate: card.timeEstimate,
        module: card.module,
        target: card.target,
        imageUrl: card.imageUrl,
        columnId,
        sprintId: card.sprintId, // Add sprintId to the API call
        assigneeId, // Add assigneeId to the API call
      });

      await refreshData();
    } catch (err) {
      console.error("Error adding card:", err);
      setError("Failed to add task");
    }
  };

  const updateCard = async (columnId: string, card: CardType) => {
    try {
      // Find the assignee ID from the users list
      let assigneeId = undefined;
      if (card.assignee) {
        const assigneeUser = users.find((user) => user.name === card.assignee);
        if (assigneeUser) {
          assigneeId = assigneeUser.id;
        }
      }

      const response = await fetch(`/api/tasks`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: card.id,
          title: card.title,
          description: card.description,
          priority: card.priority,
          storyPoints: card.storyPoints,
          progress: card.progress,
          timeEstimate: card.timeEstimate,
          assigneeId, // Add assigneeId to the API call
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      await refreshData();
    } catch (err) {
      console.error("Error updating card:", err);
      setError("Failed to update task");
    }
  };

  const deleteCard = async (columnId: string, cardId: string) => {
    try {
      const response = await fetch(`/api/tasks?id=${cardId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      await refreshData();
    } catch (err) {
      console.error("Error deleting card:", err);
      setError("Failed to delete task");
    }
  };

  const moveCard = async (
    cardId: string,
    fromColumnId: string,
    toColumnId: string
  ) => {
    // Check if user has permission to move cards
    if (
      currentUser &&
      !userService.hasPermission(currentUser.role, "move_task")
    ) {
      setError("You don't have permission to move tasks");
      return;
    }

    try {
      // Update the task's column in the database
      const response = await fetch(`/api/tasks`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: cardId,
          columnId: toColumnId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to move task");
      }

      await refreshData();
    } catch (err) {
      console.error("Error moving card:", err);
      setError("Failed to move task");
    }
  };

  const addSprint = async (sprint: any) => {
    // Check if user has permission to create sprints
    if (
      currentUser &&
      !userService.hasPermission(currentUser.role, "create_sprint")
    ) {
      setError("You don't have permission to create sprints");
      return;
    }

    try {
      const response = await fetch(`/api/sprints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sprint),
      });

      if (!response.ok) {
        throw new Error("Failed to add sprint");
      }

      await refreshSprints();
    } catch (err) {
      console.error("Error adding sprint:", err);
      setError("Failed to add sprint");
    }
  };

  const updateSprint = async (id: string, sprint: any) => {
    // Check if user has permission to edit sprints
    if (
      currentUser &&
      !userService.hasPermission(currentUser.role, "edit_sprint")
    ) {
      setError("You don't have permission to edit sprints");
      return;
    }

    try {
      const response = await fetch(`/api/sprints`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...sprint,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update sprint");
      }

      await refreshSprints();
    } catch (err) {
      console.error("Error updating sprint:", err);
      setError("Failed to update sprint");
    }
  };

  const deleteSprint = async (id: string) => {
    // Check if user has permission to delete sprints
    if (
      currentUser &&
      !userService.hasPermission(currentUser.role, "delete_sprint")
    ) {
      setError("You don't have permission to delete sprints");
      return;
    }

    try {
      const response = await fetch(`/api/sprints?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete sprint");
      }

      await refreshSprints();
      if (currentSprint && currentSprint.id === id) {
        setCurrentSprint(null);
      }
    } catch (err) {
      console.error("Error deleting sprint:", err);
      setError("Failed to delete sprint");
    }
  };

  const createUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    // Check if user has permission to create users
    if (
      currentUser &&
      !userService.hasPermission(currentUser.role, "create_user")
    ) {
      setError("You don't have permission to create users");
      return;
    }

    try {
      const response = await fetch(`/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      await refreshUsers();
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create user");
    }
  };

  const updateUser = async (
    id: string,
    userData: { name?: string; email?: string; role?: string }
  ) => {
    // Check if user has permission to edit users
    if (
      currentUser &&
      !userService.hasPermission(currentUser.role, "edit_user")
    ) {
      setError("You don't have permission to edit users");
      return;
    }

    try {
      const response = await fetch(`/api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...userData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      await refreshUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user");
    }
  };

  const deleteUser = async (id: string) => {
    // Check if user has permission to delete users
    if (
      currentUser &&
      !userService.hasPermission(currentUser.role, "delete_user")
    ) {
      setError("You don't have permission to delete users");
      return;
    }

    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      await refreshUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
    }
  };

  const hasPermission = (action: string): boolean => {
    if (!currentUser) return false;
    return userService.hasPermission(currentUser.role, action);
  };

  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return null;
      }

      setCurrentUser(data);
      return data;
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
      return null;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <DatabaseContext.Provider
      value={{
        columns,
        sprints,
        currentSprint,
        loading,
        error,
        currentUser,
        users,
        refreshData,
        addColumn,
        updateColumn,
        deleteColumn,
        addCard,
        updateCard,
        deleteCard,
        moveCard,
        refreshSprints,
        setCurrentSprint,
        addSprint,
        updateSprint,
        deleteSprint,
        setCurrentUser,
        refreshUsers,
        createUser,
        updateUser,
        deleteUser,
        hasPermission,
        login,
        logout,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
