// authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../../src/controllers/Auth/authController');
const authMiddleware = require('../../src/middleware/authMiddleware');
const authValidator = require('../validators/Auth/authValidator');

router.post('/register', authValidator.registerValidator, authController.register);
router.post('/login', authValidator.loginValidator, authController.login);
router.get('/profile', authMiddleware.authenticate, authController.getProfile);

module.exports = router;