// authValidator.js

const { body } = require('express-validator');

module.exports = {
  registerValidator: [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
    body('role')
      .optional()
      .isIn(['user', 'staff'])
      .withMessage('Role must be either user or staff')
  ],
  loginValidator: [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
  ]
};