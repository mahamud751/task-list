"use client";

import { useEffect, useState, useMemo } from "react";
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
  sprintId: string; // Add sprintId filter
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
  sprintId?: string; // Add sprintId field
}

function HomeContent() {
  const {
    currentUser,
    setCurrentUser,
    columns,
    sprints,
    currentSprint,
    setCurrentSprint,
  } = useDatabase();
  const [activeView, setActiveView] = useState("sprints"); // Changed default to sprints
  const [selectedSprint, setSelectedSprint] = useState<SprintType | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    priority: "all",
    assignee: "all",
    module: "all",
    target: "all",
    sprintId: "all", // Add sprintId filter
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

  // Function to handle going back to sprints list
  const handleBackToSprints = () => {
    setSelectedSprint(null);
    setCurrentSprint(null);
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
          sprintId: card.sprintId, // Add sprintId
        });
      });
    });

    return allTasks;
  };

  // Get all tasks for timeline view - make this a useMemo or similar to update when columns change
  const timelineTasks = useMemo(() => getAllTasksFromColumns(), [columns]);

  // Wrapper function to match the expected signature for timeline view
  const handleTimelineFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  // Wrapper function to match the expected signature for sprint detail view
  const handleSprintFilterChange = (newFilters: {
    searchTerm: string;
    priority: string;
    assignee: string;
    module: string;
    target: string;
  }) => {
    setFilters({
      ...filters,
      ...newFilters,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <TopNavbar
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenUserManagement={() => setIsUserManagementOpen(true)}
        sprints={sprints} // Pass sprints data
        currentSprint={currentSprint || selectedSprint} // Pass current sprint
        onSprintSelect={(sprint) => {
          setSelectedSprint(sprint);
          setCurrentSprint(sprint);
        }} // Handle sprint selection
        onBackToSprints={handleBackToSprints} // Pass the back function
      />

      {/* Show sidebar filters only in sprint detail view or timeline view */}
      {(selectedSprint || activeView === "timeline") && (
        <Sidebar
          onFilterChange={handleTimelineFilterChange}
          currentFilters={filters} // Pass current filters
        />
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
            onBack={handleBackToSprints}
            onFilterChange={handleSprintFilterChange}
            filters={filters}
            activeView={activeView}
            onViewChange={setActiveView}
          />
        )}

        {activeView === "timeline" && !selectedSprint && (
          <TimelineView
            tasks={timelineTasks}
            filters={filters}
            onFilterChange={handleTimelineFilterChange}
            sprints={sprints.map((sprint) => ({
              id: sprint.id,
              name: sprint.name,
            }))} // Pass sprints data
          />
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
