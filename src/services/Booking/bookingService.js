// src/services/Booking/bookingService.js

const { v4: uuidv4 } = require('uuid');
const prisma = require('../../utils/prisma');
const { generateBookingCode, validateBookingTime } = require('../../utils/helpers/bookingHelpers');

class BookingService {
  async getAvailableSlots(parkingId) {
    return await prisma.slot.findMany({
      where: {
        parking_id: parkingId,
        is_available: true
      },
      select: {
        slot_id: true,
        slot_number: true,
        vehicle_type: true
      },
      orderBy: {
        slot_number: 'asc'
      }
    });
  }

  async createBooking(userId, slotId, vehicleType, licensePlate) {
    const slot = await prisma.slot.findUnique({
      where: { slot_id: slotId },
      include: { parking: true }
    });

    if (!slot) throw new Error('Slot not found');
    if (!slot.is_available) throw new Error('Slot is not available');
    if (!slot.parking.is_active) throw new Error('Parking location is not active');

    const bookingData = {
      booking_id: uuidv4(),
      booking_code: generateBookingCode(),
      user_id: userId,
      slot_id: slotId,
      vehicle_type: vehicleType,
      license_plate: licensePlate,
      reserve_time: new Date(),
      status: 'reserved'
    };

    return await prisma.$transaction([
      prisma.booking.create({
        data: bookingData,
        include: {
          slot: true // agar bisa diakses di controller (slot_number, dll)
        }
      }),
      prisma.slot.update({
        where: { slot_id: slotId },
        data: { is_available: false }
      })
    ]);
  }

  async getBookingByCode(bookingCode) {
    return await prisma.booking.findUnique({
      where: { booking_code: bookingCode },
      include: {
        slot: {
          include: {
            parking: true
          }
        }
      }
    });
  }

  async processCheckIn(bookingCode) {
    return await prisma.booking.update({
      where: {
        booking_code: bookingCode,
        status: 'reserved'
      },
      data: {
        check_in_time: new Date(),
        status: 'active'
      }
    });
  }

  async processCheckOut(bookingCode, staffId) {
    const booking = await prisma.booking.findUnique({
      where: { booking_code: bookingCode },
      include: { slot: { include: { parking: true } } }
    });

    if (!booking || booking.status !== 'active') {
      throw new Error('Valid active booking not found');
    }

    const checkOutTime = new Date();
    const durationMinutes = Math.ceil((checkOutTime - booking.check_in_time) / (1000 * 60));
    const hours = Math.ceil(durationMinutes / 60);
    let amount = Math.max(hours * booking.slot.parking.hourly_rate, booking.slot.parking.min_rate);
    amount = Math.ceil(amount / 500) * 500;

    return await prisma.$transaction([
      prisma.booking.update({
        where: { booking_code: bookingCode },
        data: {
          check_out_time: checkOutTime,
          status: 'completed'
        }
      }),
      prisma.payment.create({
        data: {
          payment_id: uuidv4(),
          booking_id: booking.booking_id,
          amount: amount,
          duration_minutes: durationMinutes,
          payment_method: 'cash',
          staff_id: staffId,
          paid_at: checkOutTime
        }
      }),
      prisma.slot.update({
        where: { slot_id: booking.slot_id },
        data: { is_available: true }
      })
    ]);
  }

  async checkParkingAvailability(parkingId, date, time) {
    const reserveTime = validateBookingTime(date, time);

    const parking = await prisma.parking.findUnique({
      where: { parking_id: parkingId }
    });

    if (!parking) {
      throw new Error('Parking location not found');
    }

    const availableSlots = await prisma.slot.findMany({
      where: {
        parking_id: parkingId,
        is_available: true
      },
      select: {
        slot_id: true,
        slot_number: true,
        vehicle_type: true
      }
    });

    return {
      parking,
      reserveTime,
      availableSlots
    };
  }

  async createBookingV2(userId, parkingId, slotId, vehicleType, licensePlate, date, time) {
    // Validasi format plat nomor (contoh: B1234XYZ)
    const plateRegex = /^[A-Za-z]{1,2}\d{4,5}[A-Za-z]{0,3}$/;
    if (!plateRegex.test(licensePlate)) {
      throw new Error('Invalid license plate format');
    }

    // Validasi vehicleType
    const validTypes = ['car', 'motorcycle'];
    if (!validTypes.includes(vehicleType)) {
      throw new Error('Invalid vehicle type');
    }

    const reserveTime = validateBookingTime(date, time);

    const slot = await prisma.slot.findUnique({
      where: { slot_id: slotId },
      include: { parking: true }
    });

    if (!slot) throw new Error('Slot not found');
    if (!slot.is_available) throw new Error('Slot is not available');
    if (slot.parking_id !== parkingId) throw new Error('Slot does not belong to this parking');
    if (!slot.parking.is_active) throw new Error('Parking location is not active');

    const bookingData = {
      booking_id: uuidv4(),
      booking_code: generateBookingCode(),
      user_id: userId,
      slot_id: slotId,
      vehicle_type: vehicleType,
      license_plate: licensePlate,
      reserve_time: reserveTime,
      status: 'reserved'
    };

    const [newBooking] = await prisma.$transaction([
      prisma.booking.create({
        data: bookingData,
        include: {
          slot: {
            include: {
              parking: true
            }
          }
        }
      }),
      prisma.slot.update({
        where: { slot_id: slotId },
        data: { is_available: false }
      })
    ]);

    return newBooking;
  }
}

module.exports = new BookingService();