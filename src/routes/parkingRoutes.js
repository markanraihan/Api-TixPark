// src/routes/parkingRoutes.js
const express = require('express')
const router = express.Router()
const parkingController = require('../controllers/Parking/parkingController')
const { authenticate } = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')

// Public routes
router.get('/', parkingController.getAllParkings)
router.get('/:parkingId', parkingController.getParkingDetails)
router.get('/:parkingId/slots', parkingController.getAvailableSlots)

// Admin-only routes
router.post('/', authenticate, adminMiddleware, parkingController.createParking)
router.post('/:parkingId/slots', authenticate, adminMiddleware, parkingController.addSlotToParking) // Fixed method name
router.put('/:parkingId', authenticate, adminMiddleware, parkingController.updateParking)
router.delete('/:parkingId', authenticate, adminMiddleware, parkingController.deleteParking)

module.exports = router