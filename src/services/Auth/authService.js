// authService.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userRepository = require('../../repositories/Auth/userRepository');

const { JWT_SECRET } = process.env;

class AuthService {
  async register(userData) {
    const existingUser = await userRepository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }
    
    return await userRepository.createUser(userData);
  }

  async login(email, password) {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return {
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };
  }

  async getProfile(user_id) {
    return await userRepository.findUserById(user_id);
  }
}

module.exports = new AuthService();