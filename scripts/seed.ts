import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Check if data already exists
  const existingColumns = await prisma.column.count();
  const existingUsers = await prisma.user.count();
  const existingTasks = await prisma.task.count();

  if (existingColumns > 0 || existingUsers > 0 || existingTasks > 0) {
    console.log("Database already seeded. Skipping...");
    return;
  }

  // Create sample columns
  const todoColumn = await prisma.column.create({
    data: {
      title: "To Do",
      order: 1,
    },
  });

  const inProgressColumn = await prisma.column.create({
    data: {
      title: "In Progress",
      order: 2,
    },
  });

  const doneColumn = await prisma.column.create({
    data: {
      title: "Done",
      order: 3,
    },
  });

  // Create admin user with specified credentials
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "arogga@gmail.com",
      password: "123456789", // In a real app, this should be hashed
      role: "admin",
    },
  });

  // Create sample users with roles
  const developerUser = await prisma.user.create({
    data: {
      name: "Developer User",
      email: "dev@example.com",
      password: "dev123",
      role: "developer",
    },
  });

  const testerUser = await prisma.user.create({
    data: {
      name: "Tester User",
      email: "tester@example.com",
      password: "tester123",
      role: "tester",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: "Alex",
      email: "alex@example.com",
      password: "password123",
      role: "developer",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Sam",
      email: "sam@example.com",
      password: "password123",
      role: "developer",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Jordan",
      email: "jordan@example.com",
      password: "password123",
      role: "tester",
    },
  });

  const user4 = await prisma.user.create({
    data: {
      name: "Taylor",
      email: "taylor@example.com",
      password: "password123",
      role: "tester",
    },
  });

  // Create sample tasks
  await prisma.task.create({
    data: {
      taskId: "PROJ-1",
      title: "Implement drag and drop",
      description: "Create components with drag and drop functionality",
      priority: "high",
      storyPoints: 5,
      assignee: {
        connect: {
          id: user1.id,
        },
      },
      column: {
        connect: {
          id: todoColumn.id,
        },
      },
      timeEstimate: "2d",
    },
  });

  await prisma.task.create({
    data: {
      taskId: "PROJ-2",
      title: "Add animations",
      description: "Implement smooth animations for card movements",
      priority: "medium",
      storyPoints: 3,
      assignee: {
        connect: {
          id: user2.id,
        },
      },
      column: {
        connect: {
          id: todoColumn.id,
        },
      },
      timeEstimate: "1d",
    },
  });

  await prisma.task.create({
    data: {
      taskId: "PROJ-3",
      title: "Design UI",
      description: "Create a beautiful UI with Tailwind CSS",
      priority: "critical",
      storyPoints: 8,
      progress: 65,
      assignee: {
        connect: {
          id: user3.id,
        },
      },
      column: {
        connect: {
          id: inProgressColumn.id,
        },
      },
      timeEstimate: "3d",
    },
  });

  await prisma.task.create({
    data: {
      taskId: "PROJ-4",
      title: "Project setup",
      description: "Initialize Next.js project with Tailwind CSS",
      priority: "low",
      storyPoints: 2,
      progress: 100,
      assignee: {
        connect: {
          id: user4.id,
        },
      },
      column: {
        connect: {
          id: doneColumn.id,
        },
      },
      timeEstimate: "1d",
    },
  });

  console.log("Database seeded successfully!");
  console.log(
    "Admin user created with email: arogga@gmail.com and password: 123456789"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
