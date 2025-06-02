// src/repositories/Booking/bookingRepository.js

const prisma = require('../../utils/prisma')

class BookingRepository {
  async createBookingTransaction(bookingData, slotId, parkingId) {
    return await prisma.$transaction([
      prisma.booking.create({ data: bookingData }),
      prisma.slot.update({
        where: { slot_id: slotId },
        data: { is_available: false }
      }),
      prisma.parking.update({
        where: { parking_id: parkingId },
        data: { available_slots: { decrement: 1 } }
      })
    ])
  }

  async getBookingByCode(bookingCode) {
    return await prisma.booking.findUnique({
      where: { booking_code: bookingCode }
    })
  }
}

module.exports = new BookingRepository()