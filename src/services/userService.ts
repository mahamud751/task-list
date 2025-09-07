import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Note: This service should primarily be used on the server side
// For client-side operations, use API calls instead

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export const userService = {
  // Check if user has permission for an action
  hasPermission: (userRole: string, action: string): boolean => {
    const permissions: Record<string, string[]> = {
      admin: [
        "create_task",
        "edit_task",
        "delete_task",
        "move_task",
        "create_sprint",
        "edit_sprint",
        "delete_sprint",
        "create_user",
        "edit_user",
        "delete_user",
        "view_timeline",
        "view_reports",
      ],
      developer: ["create_task", "edit_task", "move_task", "view_timeline"],
      tester: ["edit_task", "move_task", "view_timeline"],
    };

    return permissions[userRole]?.includes(action) || false;
  },

  // Client-side functions that use API calls
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<User> => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create user");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  updateUser: async (
    id: string,
    userData: { name?: string; email?: string; role?: string }
  ): Promise<User> => {
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...userData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};
