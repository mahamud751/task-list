"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { userService, User } from "../../services/userService";
import { useTheme } from "./ThemeProvider";

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export default function UserManagementModal({
  isOpen,
  onClose,
  currentUser,
}: UserManagementModalProps) {
  const { theme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "developer",
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Theme-based colors
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";
  const secondaryTextColor =
    theme === "dark" ? "text-gray-300" : "text-gray-700";
  const mutedTextColor = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const inputBgColor = theme === "dark" ? "dark:bg-gray-700" : "bg-white";
  const inputBorderColor =
    theme === "dark" ? "dark:border-gray-600" : "border-gray-300";
  const inputTextColor = theme === "dark" ? "dark:text-white" : "text-gray-900";
  const placeholderTextColor =
    theme === "dark" ? "dark:placeholder-gray-400" : "placeholder-gray-500";
  const errorBgColor = theme === "dark" ? "bg-red-900/80" : "bg-red-100";
  const errorTextColor = theme === "dark" ? "text-red-200" : "text-red-700";
  const dividerColor =
    theme === "dark" ? "dark:border-gray-700" : "border-gray-200";
  const closeButtonColor =
    theme === "dark"
      ? "text-gray-400 hover:text-gray-200"
      : "text-gray-500 hover:text-gray-700";
  const tableHeaderText = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const tableRowHover =
    theme === "dark" ? "dark:hover:bg-gray-700/50" : "hover:bg-gray-50";

  // Fetch all users
  useEffect(() => {
    if (isOpen && currentUser?.role === "admin") {
      fetchUsers();
    }
  }, [isOpen, currentUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userData = await userService.getAllUsers();
      setUsers(userData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.createUser(newUser);
      setNewUser({ name: "", email: "", password: "", role: "developer" });
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setError("Failed to create user");
      console.error(err);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await userService.updateUser(editingUser.id, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      });
      setEditingUser(null);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setError("Failed to update user");
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await userService.deleteUser(userId);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setError("Failed to delete user");
      console.error(err);
    }
  };

  if (currentUser?.role !== "admin") {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`px-6 py-4 border-b ${dividerColor} flex justify-between items-center`}
            >
              <h2 className={`text-xl font-bold ${textColor}`}>
                User Management
              </h2>
              <button onClick={onClose} className={closeButtonColor}>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div
                  className={`mb-4 p-3 ${errorBgColor} ${errorTextColor} rounded-md glass-card`}
                >
                  {error}
                </div>
              )}

              {/* Create User Form */}
              <div className="mb-8">
                <h3 className={`text-lg font-medium ${textColor} mb-4`}>
                  Create New User
                </h3>
                <form
                  onSubmit={handleCreateUser}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <label
                      className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} transition-all duration-200 ${placeholderTextColor}`}
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      placeholder="Enter user name"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} transition-all duration-200 ${placeholderTextColor}`}
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      placeholder="Enter user email"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} transition-all duration-200 ${placeholderTextColor}`}
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      placeholder="Enter password"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                    >
                      Role
                    </label>
                    <select
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} transition-all duration-200`}
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                    >
                      <option value="developer">Developer</option>
                      <option value="designer">Designer</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Create User
                    </button>
                  </div>
                </form>
              </div>

              {/* Edit User Form */}
              {editingUser && (
                <div className="mb-8 glass-card p-6 rounded-lg">
                  <h3 className={`text-lg font-medium ${textColor} mb-4`}>
                    Edit User
                  </h3>
                  <form
                    onSubmit={handleUpdateUser}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label
                        className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} transition-all duration-200`}
                        value={editingUser.name}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} transition-all duration-200`}
                        value={editingUser.email}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                      >
                        Role
                      </label>
                      <select
                        className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgColor} ${inputBorderColor} ${inputTextColor} transition-all duration-200`}
                        value={editingUser.role}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            role: e.target.value,
                          })
                        }
                      >
                        <option value="developer">Developer</option>
                        <option value="designer">Designer</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 flex space-x-3">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Update User
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingUser(null)}
                        className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                          theme === "dark"
                            ? "bg-gray-600 text-white hover:bg-gray-700"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* User List */}
              <div>
                <h3 className={`text-lg font-medium ${textColor} mb-4`}>
                  Existing Users
                </h3>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${tableHeaderText}`}
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${tableHeaderText}`}
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${tableHeaderText}`}
                          >
                            Role
                          </th>
                          <th
                            scope="col"
                            className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${tableHeaderText}`}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr
                            key={user.id}
                            className={`glass-card ${tableRowHover}`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                  <div
                                    className={`text-sm font-medium ${textColor}`}
                                  >
                                    {user.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm ${secondaryTextColor}`}>
                                {user.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  theme === "dark"
                                    ? "bg-indigo-900/50 text-indigo-200"
                                    : "bg-indigo-100 text-indigo-800"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => setEditingUser(user)}
                                className={`mr-3 ${
                                  theme === "dark"
                                    ? "text-indigo-400 hover:text-indigo-300"
                                    : "text-indigo-600 hover:text-indigo-900"
                                }`}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className={
                                  theme === "dark"
                                    ? "text-red-400 hover:text-red-300"
                                    : "text-red-600 hover:text-red-900"
                                }
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
