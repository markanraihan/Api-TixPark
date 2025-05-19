// src/repositories/Auth/userRepository.js
const prisma = require('../../../src/utils/prisma');
const bcrypt = require('bcrypt');

class UserRepository {
  async findUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'user',
        whatsapp: userData.whatsapp,
        license_plate: userData.license_plate || null
      }
    });
  }

  async findUserById(user_id) {
    return await prisma.user.findUnique({
      where: { user_id },
      select: {
        user_id: true,
        email: true,
        name: true,
        whatsapp: true,
        role: true,
        created_at: true
      }
    });
  }
}

module.exports = UserRepository;