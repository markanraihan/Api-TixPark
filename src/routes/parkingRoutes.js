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

router.get('/search', authenticate, async (req, res) => {
    try {
      const { q } = req.query;
      
      const results = await prisma.parking.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { address: { contains: q, mode: 'insensitive' } }
          ],
          is_active: true
        },
        select: {
          parking_id: true,
          name: true,
          address: true,
          total_slots: true,
          hourly_rate: true
        }
      });
      
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Admin-only routes
router.post('/', authenticate, adminMiddleware, parkingController.createParking)
router.post('/:parkingId/slots', authenticate, adminMiddleware, parkingController.addSlotToParking) // Fixed method name
router.put('/:parkingId', authenticate, adminMiddleware, parkingController.updateParking)
router.delete('/:parkingId', authenticate, adminMiddleware, parkingController.deleteParking)

module.exports = router