// src/controllers/Booking/bookingController.js

const bookingService = require('../../services/Booking/bookingService');

class BookingController {
  async getAvailableSlots(req, res, next) {
    try {
      const { parkingId } = req.params;
      const slots = await bookingService.getAvailableSlots(parkingId);
      res.status(200).json({
        status: 'success',
        data: slots
      });
    } catch (error) {
      next(error);
    }
  }

  async createBooking(req, res, next) {
    try {
      const { user } = req;

      if (!user || !user.user_id) {
        return res.status(401).json({ error: 'Unauthorized: User ID not found' });
      }

      const { slotId, vehicleType, licensePlate } = req.body;

      if (!slotId || !vehicleType || !licensePlate) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const [newBooking] = await bookingService.createBooking(
        user.user_id,
        slotId,
        vehicleType,
        licensePlate
      );

      res.status(201).json({
        status: 'success',
        data: {
          booking_code: newBooking.booking_code,
          slot_number: newBooking.slot.slot_number,
          status: newBooking.status,
          reserve_time: newBooking.reserve_time
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getBooking(req, res, next) {
    try {
      const { bookingCode } = req.params;
      const booking = await bookingService.getBookingByCode(bookingCode);

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.status(200).json({
        status: 'success',
        data: booking
      });
    } catch (error) {
      next(error);
    }
  }

  async checkIn(req, res, next) {
    try {
      const { bookingCode } = req.params;
      const booking = await bookingService.processCheckIn(bookingCode);

      if (!booking) {
        return res.status(404).json({ error: 'Valid booking not found' });
      }

      res.status(200).json({
        status: 'success',
        data: {
          booking_code: booking.booking_code,
          check_in_time: booking.check_in_time,
          status: booking.status
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async checkOut(req, res, next) {
    try {
      const { bookingCode } = req.params;
      const { user } = req;

      if (!user || !user.user_id) {
        return res.status(401).json({ error: 'Unauthorized: Staff ID not found' });
      }

      const staffId = user.user_id;

      const [updatedBooking, payment] = await bookingService.processCheckOut(bookingCode, staffId);

      res.status(200).json({
        status: 'success',
        data: {
          booking_code: updatedBooking.booking_code,
          check_out_time: updatedBooking.check_out_time,
          status: updatedBooking.status,
          payment: {
            amount: payment.amount,
            duration: payment.duration_minutes,
            paid_at: payment.paid_at
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async checkAvailabilityV2(req, res, next) {
    try {
      const { parkingId, date, time } = req.query;
      
      if (!parkingId || !date || !time) {
        return res.status(400).json({ error: 'Parking ID, date and time are required' });
      }

      const { parking, reserveTime, availableSlots } = await bookingService.checkParkingAvailability(parkingId, date, time);

      res.status(200).json({
        status: 'success',
        data: {
          parking: {
            name: parking.name,
            address: parking.address,
            hourly_rate: parking.hourly_rate
          },
          reserve_time: reserveTime,
          available_slots: availableSlots
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async createBookingV2(req, res, next) {
    try {
      const { user } = req;
      const { parkingId, slotId, vehicleType, licensePlate, date, time } = req.body;

      if (!parkingId || !slotId || !vehicleType || !licensePlate || !date || !time) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const newBooking = await bookingService.createBookingV2(
        user.user_id,
        parkingId,
        slotId,
        vehicleType,
        licensePlate,
        date,
        time
      );

      res.status(201).json({
        status: 'success',
        data: {
          booking_code: newBooking.booking_code,
          parking_name: newBooking.slot.parking.name,
          slot_number: newBooking.slot.slot_number,
          vehicle_type: newBooking.vehicle_type,
          license_plate: newBooking.license_plate,
          reserve_time: newBooking.reserve_time,
          status: newBooking.status
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();
