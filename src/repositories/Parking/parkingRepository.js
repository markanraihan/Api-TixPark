const prisma = require('../../utils/prisma')

class ParkingRepository {
  async getAllActiveParkings() {
    return await prisma.parking.findMany({
      where: { is_active: true },
      select: {
        parking_id: true,
        name: true,
        address: true,
        available_slots: true,
        total_slots: true,
        hourly_rate: true,
        latitude: true,
        longitude: true
      }
    })
  }

  async getParkingById(parkingId) {
    return await prisma.parking.findUnique({
      where: { parking_id: parkingId }
    })
  }

  async getAvailableSlotsByType(parkingId, vehicleType) {
    return await prisma.slot.findMany({
      where: { 
        parking_id: parkingId,
        is_available: true,
        vehicle_type: vehicleType 
      },
      select: {
        slot_id: true,
        slot_code: true,
        vehicle_type: true
      }
    })
  }

  async createParking(parkingData) {
    return await prisma.parking.create({
      data: parkingData
    })
  }

  async createSlots(parkingId, slotsData) {
    return await prisma.$transaction([
      ...slotsData.map(slot => prisma.slot.create({
        data: {
          parking_id: parkingId,
          slot_code: slot.slot_code,
          vehicle_type: slot.vehicle_type || 'car',
          is_available: true
        }
      })),
      prisma.parking.update({
        where: { parking_id: parkingId },
        data: {
          total_slots: { increment: slotsData.length },
          available_slots: { increment: slotsData.length }
        }
      })
    ])
  }

  async updateParking(parkingId, updateData) {
    return await prisma.parking.update({
      where: { parking_id: parkingId },
      data: updateData
    })
  }
  
  async getParkingByName(name) {
    return await prisma.parking.findFirst({
      where: { name }
    })
  }

  async getParkingWithRelations(parkingId) {
    return await prisma.parking.findUnique({
      where: { parking_id: parkingId },
      include: {
        slots: true,
        staff_members: true
      }
    })
  }

  async deleteParking(parkingId) {
    return await prisma.$transaction([
      prisma.slot.deleteMany({
        where: { parking_id: parkingId }
      }),
      prisma.parking.delete({
        where: { parking_id: parkingId }
      })
    ])
  }
}

module.exports = new ParkingRepository()