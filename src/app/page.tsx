"use client";

import { useState, useEffect } from "react";
import { DatabaseProvider, useDatabase } from "./components/DatabaseProvider";
import SprintListView from "./components/SprintListView";
import SprintDetailView from "./components/SprintDetailView";
import TimelineView from "./components/TimelineView";
import DndProvider from "./components/DndProvider";
import LoginModal from "./components/LoginModal";
import UserManagementModal from "./components/UserManagementModal";
import { motion } from "framer-motion";
import { User } from "../services/userService";

interface FilterOptions {
  searchTerm: string;
  priority: string;
  assignee: string;
  module: string;
  target: string;
}

function HomeContent() {
  const { currentUser, setCurrentUser, logout } = useDatabase();
  const [activeView, setActiveView] = useState("sprints"); // Default to sprints view
  const [selectedSprint, setSelectedSprint] = useState<any | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    priority: "all",
    assignee: "all",
    module: "all",
    target: "all",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (currentUser) {
      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
    }
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setIsLoginModalOpen(true);
  };

  // Sample tasks data for timeline view
  const timelineTasks = [
    {
      id: "1",
      taskId: "PROJ-1",
      title: "Implement drag and drop",
      description: "Create components with drag and drop functionality",
      priority: "high",
      storyPoints: 5,
      assignee: "Alex",
      timeEstimate: "2d",
      startDate: "2023-06-01",
      dueDate: "2023-06-05",
      columnId: "todo",
      progress: 0,
      module: "Frontend",
      target: "Web",
    },
    {
      id: "2",
      taskId: "PROJ-2",
      title: "Add animations",
      description: "Implement smooth animations for card movements",
      priority: "medium",
      storyPoints: 3,
      assignee: "Sam",
      timeEstimate: "1d",
      startDate: "2023-06-02",
      dueDate: "2023-06-03",
      columnId: "todo",
      progress: 0,
      module: "Frontend",
      target: "Web",
    },
    {
      id: "3",
      taskId: "PROJ-3",
      title: "Design UI",
      description: "Create a beautiful UI with Tailwind CSS",
      priority: "critical",
      storyPoints: 8,
      assignee: "Jordan",
      progress: 65,
      timeEstimate: "3d",
      startDate: "2023-05-28",
      dueDate: "2023-06-10",
      columnId: "in-progress",
      module: "Frontend",
      target: "Web",
    },
    {
      id: "4",
      taskId: "PROJ-4",
      title: "Project setup",
      description: "Initialize Next.js project with Tailwind CSS",
      priority: "low",
      storyPoints: 2,
      assignee: "Taylor",
      progress: 100,
      timeEstimate: "1d",
      startDate: "2023-05-20",
      dueDate: "2023-05-21",
      columnId: "done",
      module: "Backend",
      target: "Web",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {activeView === "sprints" && !selectedSprint && (
        <SprintListView
          onSprintSelect={setSelectedSprint}
          onViewChange={setActiveView}
          onFilterChange={setFilters}
          filters={filters}
        />
      )}

      {selectedSprint && (
        <SprintDetailView
          sprint={selectedSprint}
          onBack={() => setSelectedSprint(null)}
          onFilterChange={setFilters}
          filters={filters}
        />
      )}

      {activeView === "timeline" && (
        <div className="flex-1">
          <header className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-30">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Timeline
              </h1>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
                {currentUser?.role === "admin" && (
                  <button
                    onClick={() => setIsUserManagementOpen(true)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="User Management"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      ></path>
                    </svg>
                  </button>
                )}
                <div className="relative group">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold cursor-pointer">
                    {currentUser?.name.charAt(0)}
                  </div>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                      <div className="font-medium">{currentUser?.name}</div>
                      <div className="text-xs text-gray-500">
                        {currentUser?.email}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="pt-16">
            <TimelineView tasks={timelineTasks} />
          </main>
        </div>
      )}

      {!isLoggedIn && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
        />
      )}

      <UserManagementModal
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}

export default function Home() {
  return (
    <DatabaseProvider>
      <DndProvider>
        <HomeContent />
      </DndProvider>
    </DatabaseProvider>
  );
}
