// src/utils/prisma.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Tes koneksi
prisma.$connect()
  .then(() => console.log('Prisma connected to database'))
  .catch(err => {
    console.error('Prisma connection error:', err);
    process.exit(1);
  });

module.exports = prisma;