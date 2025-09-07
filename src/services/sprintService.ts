import { prisma } from "../lib/prisma";

export interface SprintType {
  id: string;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status: string;
  tasks: any[];
  createdAt: Date;
  updatedAt: Date;
}

// Sprint operations
export async function getSprints() {
  try {
    const sprints = await prisma.sprint.findMany({
      include: {
        tasks: {
          include: {
            assignee: true,
            column: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return sprints;
  } catch (error) {
    console.error("Error fetching sprints:", error);
    throw error;
  }
}

export async function createSprint(data: {
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
}) {
  try {
    const sprint = await prisma.sprint.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status || "planned",
      },
    });

    return sprint;
  } catch (error) {
    console.error("Error creating sprint:", error);
    throw error;
  }
}

export async function updateSprint(
  id: string,
  data: {
    name?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }
) {
  try {
    const sprint = await prisma.sprint.update({
      where: { id },
      data,
    });

    return sprint;
  } catch (error) {
    console.error("Error updating sprint:", error);
    throw error;
  }
}

export async function deleteSprint(id: string) {
  try {
    await prisma.sprint.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting sprint:", error);
    throw error;
  }
}

export async function getSprintById(id: string) {
  try {
    const sprint = await prisma.sprint.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            assignee: true,
            column: true,
          },
        },
      },
    });

    return sprint;
  } catch (error) {
    console.error("Error fetching sprint:", error);
    throw error;
  }
}
