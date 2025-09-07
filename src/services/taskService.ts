import { prisma } from "../lib/prisma";
import { CardType, ColumnType } from "../app/components/DataProvider";

// Column operations
export async function getColumns() {
  try {
    const columns = await prisma.column.findMany({
      include: {
        tasks: {
          include: {
            assignee: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    // Transform Prisma data to match frontend types
    return columns.map((column) => ({
      id: column.id,
      title: column.title,
      cards: column.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        storyPoints: task.storyPoints || undefined,
        assignee: task.assignee?.name || undefined,
        progress: task.progress,
        timeEstimate: task.timeEstimate || undefined,
      })),
    })) as ColumnType[];
  } catch (error) {
    console.error("Error fetching columns:", error);
    throw error;
  }
}

export async function createColumn(title: string, order: number) {
  try {
    const column = await prisma.column.create({
      data: {
        title,
        order,
      },
    });
    return column;
  } catch (error) {
    console.error("Error creating column:", error);
    throw error;
  }
}

export async function updateColumn(
  id: string,
  data: { title?: string; order?: number }
) {
  try {
    const column = await prisma.column.update({
      where: { id },
      data,
    });
    return column;
  } catch (error) {
    console.error("Error updating column:", error);
    throw error;
  }
}

export async function deleteColumn(id: string) {
  try {
    await prisma.column.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting column:", error);
    throw error;
  }
}

// Task operations
export async function createTask(data: {
  taskId?: string;
  title: string;
  description?: string;
  priority?: string;
  storyPoints?: number;
  progress?: number;
  timeEstimate?: string;
  module?: string;
  target?: string;
  imageUrl?: string;
  assigneeId?: string;
  columnId: string;
  sprintId?: string;
  startDate?: Date;
  dueDate?: Date;
}) {
  try {
    // Generate task ID if not provided
    const taskId = data.taskId || `PROJ-${Date.now()}`;

    const task = await prisma.task.create({
      data: {
        taskId: taskId,
        title: data.title,
        description: data.description,
        priority: data.priority || "medium",
        storyPoints: data.storyPoints,
        progress: data.progress || 0,
        timeEstimate: data.timeEstimate,
        module: data.module,
        target: data.target,
        imageUrl: data.imageUrl,
        assignee: data.assigneeId
          ? { connect: { id: data.assigneeId } }
          : undefined,
        column: { connect: { id: data.columnId } },
        sprint: data.sprintId ? { connect: { id: data.sprintId } } : undefined,
        startDate: data.startDate,
        dueDate: data.dueDate,
      },
      include: {
        assignee: true,
        column: true,
        sprint: true,
      },
    });

    return {
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
      startDate: task.startDate || undefined,
      dueDate: task.dueDate || undefined,
    } as CardType;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

export async function updateTask(
  id: string,
  data: {
    taskId?: string;
    title?: string;
    description?: string;
    priority?: string;
    storyPoints?: number;
    progress?: number;
    timeEstimate?: string;
    module?: string;
    target?: string;
    imageUrl?: string;
    assigneeId?: string;
    columnId?: string;
    sprintId?: string;
    startDate?: Date;
    dueDate?: Date;
  }
) {
  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        taskId: data.taskId,
        title: data.title,
        description: data.description,
        priority: data.priority,
        storyPoints: data.storyPoints,
        progress: data.progress,
        timeEstimate: data.timeEstimate,
        module: data.module,
        target: data.target,
        imageUrl: data.imageUrl,
        assignee: data.assigneeId
          ? { connect: { id: data.assigneeId } }
          : data.assigneeId === null
          ? { disconnect: true }
          : undefined,
        column: data.columnId ? { connect: { id: data.columnId } } : undefined,
        sprint: data.sprintId
          ? { connect: { id: data.sprintId } }
          : data.sprintId === null
          ? { disconnect: true }
          : undefined,
        startDate: data.startDate,
        dueDate: data.dueDate,
      },
      include: {
        assignee: true,
        column: true,
        sprint: true,
      },
    });

    return {
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
      startDate: task.startDate || undefined,
      dueDate: task.dueDate || undefined,
    } as CardType;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

export async function deleteTask(id: string) {
  try {
    await prisma.task.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

// User operations
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const user = await prisma.user.create({
      data,
    });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
