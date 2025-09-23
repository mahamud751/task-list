const API_BASE_URL = "/api";

export async function fetchColumns() {
  const response = await fetch(`${API_BASE_URL}/columns`);
  if (!response.ok) {
    throw new Error("Failed to fetch columns");
  }
  return response.json();
}

export async function createColumn(title: string, order: number) {
  const response = await fetch(`${API_BASE_URL}/columns`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, order }),
  });

  if (!response.ok) {
    throw new Error("Failed to create column");
  }

  return response.json();
}

export async function fetchTasks() {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
}

interface CardType {
  id: string;
  taskId?: string;
  title: string;
  description: string;
  priority: string;
  storyPoints?: number;
  assignee?: string;
  assigneeId?: string; // Add assigneeId property
  progress?: number;
  timeEstimate?: string;
  figmaLink?: string;
  module?: string;
  target?: string;
  imageUrl?: string;
  sprintId?: string;
  columnId?: string; // Add columnId property
  order?: number;
  startDate?: string;
  dueDate?: string;
}

export async function createTask(data: Omit<CardType, "id">) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
}
