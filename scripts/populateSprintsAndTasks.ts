import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create sample sprints
  const sprint1 = await prisma.sprint.create({
    data: {
      name: "Sprint 1",
      description: "First development sprint",
      status: "active",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    },
  });

  const sprint2 = await prisma.sprint.create({
    data: {
      name: "Sprint 2",
      description: "Second development sprint",
      status: "planned",
      startDate: new Date(new Date().setDate(new Date().getDate() + 14)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 28)),
    },
  });

  const backlogSprint = await prisma.sprint.create({
    data: {
      name: "Product Backlog",
      description: "Product backlog for future features",
      status: "planned",
    },
  });

  // Update existing tasks with task IDs and assign to sprints
  const tasks = await prisma.task.findMany();

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const taskId = `PROJ-${i + 1}`;
    const sprintId = i < 3 ? sprint1.id : i < 6 ? sprint2.id : backlogSprint.id;

    await prisma.task.update({
      where: { id: task.id },
      data: {
        taskId: taskId,
        sprintId: sprintId,
        module: i % 3 === 0 ? "Frontend" : i % 3 === 1 ? "Backend" : "App",
        target: i % 2 === 0 ? "Web" : "Mobile",
      },
    });
  }

  // Create some new tasks with proper task IDs
  await prisma.task.create({
    data: {
      taskId: "PROJ-100",
      title: "Implement user authentication",
      description: "Create login and registration functionality",
      priority: "high",
      storyPoints: 8,
      module: "Backend",
      target: "Web",
      column: {
        connect: {
          id:
            (
              await prisma.column.findFirst({ where: { title: "To Do" } })
            )?.id || "",
        },
      },
      sprint: {
        connect: {
          id: sprint1.id,
        },
      },
    },
  });

  await prisma.task.create({
    data: {
      taskId: "PROJ-101",
      title: "Design dashboard UI",
      description: "Create wireframes and mockups for the dashboard",
      priority: "medium",
      storyPoints: 5,
      module: "Frontend",
      target: "Web",
      column: {
        connect: {
          id:
            (
              await prisma.column.findFirst({ where: { title: "To Do" } })
            )?.id || "",
        },
      },
      sprint: {
        connect: {
          id: sprint1.id,
        },
      },
    },
  });

  console.log("Sprints and tasks populated successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
