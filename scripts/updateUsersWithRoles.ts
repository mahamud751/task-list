import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Update existing users with roles based on their names
  const users = await prisma.user.findMany();

  for (const user of users) {
    let role = "developer"; // default role

    if (user.email.includes("admin")) {
      role = "admin";
    } else if (user.email.includes("tester")) {
      role = "tester";
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { role },
    });

    console.log(`Updated user ${user.name} with role ${role}`);
  }

  // Create admin user if not exists
  const adminExists = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });

  if (!adminExists) {
    await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
      },
    });
    console.log("Created admin user");
  }

  console.log("User roles updated successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
