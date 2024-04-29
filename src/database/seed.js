const { PrismaClient } = require('@prisma/client');
const bcryptjs = require("bcryptjs");
const prisma = new PrismaClient();

async function seedDatabase() {
  let role = await prisma.role.create({
    data: {
      name: 'admin',
      roleId: 'admin',
    },
  });

  await prisma.user.create({
    data: {
      name: 'abc',
      email: 'abc@email.com',
      password: await bcryptjs.hash('123456789',10),
      roleId: role.id,
    },
  });

  console.log('Users seeded successfully!');

  await prisma.$disconnect();
}

seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });
