// userRepository.js

const prisma = require('../../utils/prisma');
const bcrypt = require('bcrypt');

class UserRepository {
  async findUserByEmail(email) {
    return await prisma.users.findUnique({
      where: { email }
    });
  }

  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await prisma.users.create({
      data: {
        ...userData,
        password: hashedPassword
      }
    });
  }

  async findUserById(user_id) {
    return await prisma.users.findUnique({
      where: { user_id },
      select: {
        user_id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
  }
}

module.exports = new UserRepository();