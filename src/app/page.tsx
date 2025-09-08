"use client";

import { useEffect, useState } from "react";
import { User } from "../services/userService";
import {
  DatabaseProvider,
  useDatabase,
  SprintType,
} from "./components/DatabaseProvider";
import DndProvider from "./components/DndProvider";
import LoginModal from "./components/LoginModal";
import Sidebar from "./components/Sidebar";
import SprintDetailView from "./components/SprintDetailView";
import SprintListView from "./components/SprintListView";
import TimelineView from "./components/TimelineView";
import TopNavbar from "./components/TopNavbar";
import UserManagementModal from "./components/UserManagementModal";

interface FilterOptions {
  searchTerm: string;
  priority: string;
  assignee: string;
  module: string;
  target: string;
}

interface TimelineTaskType {
  id: string;
  taskId?: string;
  title: string;
  description: string;
  priority: string;
  storyPoints?: number;
  assignee?: string;
  progress?: number;
  timeEstimate?: string;
  startDate: string;
  dueDate: string;
  columnId: string;
  module?: string;
  target?: string;
}

function HomeContent() {
  const { currentUser, setCurrentUser, columns } = useDatabase();
  const [activeView, setActiveView] = useState("sprints"); // Changed default to sprints
  const [selectedSprint, setSelectedSprint] = useState<SprintType | null>(null);
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

  const handleLogin = (user: {
    id: string;
    name: string;
    email: string;
    role: string;
  }) => {
    setCurrentUser({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  // Extract all tasks from columns to create timeline data
  const getAllTasksFromColumns = (): TimelineTaskType[] => {
    const allTasks: TimelineTaskType[] = [];

    columns.forEach((column) => {
      column.cards.forEach((card) => {
        // Convert card data to match TimelineView expected format
        allTasks.push({
          id: card.id,
          taskId: card.taskId || `TASK-${card.id}`,
          title: card.title,
          description: card.description,
          priority: card.priority,
          storyPoints: card.storyPoints,
          assignee: card.assignee,
          progress: card.progress,
          timeEstimate: card.timeEstimate,
          startDate: card.startDate || new Date().toISOString().split("T")[0], // Default to today if not set
          dueDate:
            card.dueDate ||
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0], // Default to 7 days from now
          columnId: column.id,
          module: card.module,
          target: card.target,
        });
      });
    });

    return allTasks;
  };

  // Get all tasks for timeline view
  const timelineTasks = getAllTasksFromColumns();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <TopNavbar activeView={activeView} onViewChange={setActiveView} />

      {/* Show sidebar filters only in sprint detail view or timeline view */}
      {(selectedSprint || activeView === "timeline") && (
        <Sidebar onFilterChange={setFilters} />
      )}

      <div
        className={
          selectedSprint || activeView === "timeline"
            ? "flex-1 ml-64 pt-16"
            : "flex-1 pt-16"
        }
      >
        {activeView === "sprints" && !selectedSprint && (
          <SprintListView
            onSprintSelect={setSelectedSprint}
            filters={filters}
          />
        )}

        {selectedSprint && (
          <SprintDetailView
            sprint={selectedSprint}
            onBack={() => setSelectedSprint(null)}
            onFilterChange={setFilters}
            filters={filters}
            activeView={activeView}
            onViewChange={setActiveView}
          />
        )}

        {activeView === "timeline" && !selectedSprint && (
          <TimelineView tasks={timelineTasks} filters={filters} />
        )}

        {/* Removed board view as requested */}
      </div>

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
