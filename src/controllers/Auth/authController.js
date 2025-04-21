// authController.js

const authService = require('../../services/Auth/authService');

class AuthController {
    async register(req, res) {
      try {
        const user = await authService.register(req.body);
        res.status(201).json({
          success: true,
          data: user
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      }
    }
  
    async login(req, res) {
      try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json({
          success: true,
          data: result
        });
      } catch (error) {
        res.status(401).json({
          success: false,
          message: error.message
        });
      }
    }
  
    async getProfile(req, res) {
      try {
        const user = await authService.getProfile(req.user.user_id);
        res.json({
          success: true,
          data: user
        });
      } catch (error) {
        res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }
    }
}
  
module.exports = new AuthController();