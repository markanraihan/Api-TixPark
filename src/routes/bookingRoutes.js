// src/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/Booking/bookingController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Get available slots for a parking
router.get('/parkings/:parkingId/slots', 
  authenticate, 
  bookingController.getAvailableSlots
);

// Create new booking (User only)
router.post('/book', 
  authenticate, 
  authorize(['user']), 
  bookingController.createBooking
);

// Get booking details
router.get('/:bookingCode', 
  authenticate, 
  bookingController.getBooking
);

// Check-in process (Staff only)
router.patch('/:bookingCode/check-in', 
  authenticate, 
  authorize(['staff']), 
  bookingController.checkIn
);

// Check-out and payment process (Staff only)
router.patch('/:bookingCode/check-out', 
  authenticate, 
  authorize(['staff']), 
  bookingController.checkOut
);

router.get('/v2/availability', 
  authenticate, 
  bookingController.checkAvailabilityV2
);

router.post('/v2/book', 
  authenticate, 
  authorize(['user']), 
  bookingController.createBookingV2
);

module.exports = router;