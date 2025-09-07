"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDatabase } from "./DatabaseProvider";
import { useTheme } from "./ThemeProvider";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: {
    id: string;
    name: string;
    email: string;
    role: string;
  }) => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLogin,
}: LoginModalProps) {
  const { login } = useDatabase();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Theme-based colors
  const backgroundColor = theme === "dark" ? "dark:bg-gray-800" : "bg-white";
  const textColor = theme === "dark" ? "dark:text-white" : "text-gray-900";
  const secondaryTextColor =
    theme === "dark" ? "dark:text-gray-300" : "text-gray-700";
  const inputBgColor = theme === "dark" ? "dark:bg-gray-700" : "";
  const inputBorderColor =
    theme === "dark" ? "dark:border-gray-600" : "border-gray-300";
  const inputTextColor = theme === "dark" ? "dark:text-white" : "";
  const footerBgColor = theme === "dark" ? "dark:bg-gray-700" : "bg-gray-50";
  const errorBgColor = theme === "dark" ? "bg-red-900" : "bg-red-100";
  const errorTextColor = theme === "dark" ? "text-red-200" : "text-red-700";
  const linkColor =
    theme === "dark"
      ? "dark:text-indigo-400 dark:hover:text-indigo-300"
      : "text-indigo-600 hover:text-indigo-500";
  const focusRingColor =
    theme === "dark" ? "focus:ring-indigo-500" : "focus:ring-indigo-500";
  const focusBorderColor =
    theme === "dark" ? "focus:border-indigo-500" : "focus:border-indigo-500";
  const dividerColor =
    theme === "dark" ? "dark:border-gray-700" : "border-gray-200";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const user = await login(email, password);
      if (user) {
        onLogin(user);
        onClose();
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
            className={`rounded-lg shadow-xl w-full max-w-md ${backgroundColor}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`px-6 py-4 border-b ${dividerColor}`}>
              <h2 className={`text-xl font-bold ${textColor}`}>
                Login to Project Manager
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4">
              {error && (
                <div
                  className={`mb-4 p-3 ${errorBgColor} ${errorTextColor} rounded-md`}
                >
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryTextColor} mb-1`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 ${focusRingColor} ${focusBorderColor} ${inputBgColor} ${inputBorderColor} ${inputTextColor}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 ${focusRingColor} ${focusBorderColor} ${inputBgColor} ${inputBorderColor} ${inputTextColor}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className={`ml-2 block text-sm ${secondaryTextColor}`}
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className={`font-medium ${linkColor}`}>
                      Forgot your password?
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : null}
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>
            <div className={`px-6 py-4 rounded-b-lg ${footerBgColor}`}>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Don&apos;t have an account?{" "}
                <a href="#" className={`font-medium ${linkColor}`}>
                  Sign up
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
