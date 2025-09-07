import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
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

  // Create only the admin user with specified credentials
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@gmail.com",
      password: "123456", // In a real app, this should be hashed
      role: "admin",
    },
  });

  console.log("Database reset with only admin user successfully!");
  console.log(
    "Admin user created with email: admin@gmail.com and password: 123456"
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
