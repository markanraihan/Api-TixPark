// src/repositories/Parking/parkingRepositories.js

const prisma = require('../../utils/prisma');

class ParkingRepository {
  async getAllActiveParkings() {
    const parkings = await prisma.parking.findMany({
      where: { is_active: true },
      include: {
        slots: {
          select: { is_available: true }
        }
      }
    });

    // Hitung available_slots dari slot yang available
    return parkings.map(p => ({
      parking_id: p.parking_id,
      name: p.name,
      address: p.address,
      total_slots: p.total_slots,
      hourly_rate: p.hourly_rate,
      latitude: p.latitude,
      longitude: p.longitude,
      available_slots: p.slots.filter(slot => slot.is_available).length
    }));
  }

  async getParkingById(parkingId) {
    return await prisma.parking.findUnique({
      where: { parking_id: parkingId }
    });
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
    });
  }

  async createParking(parkingData) {
    // Hapus available_slots karena tidak ada di model Prisma
    const { available_slots, ...data } = parkingData;
    return await prisma.parking.create({ data });
  }

  async createSlots(parkingId, slotsData) {
    return await prisma.$transaction([
      ...slotsData.map(slot => prisma.slot.create({
        data: {
          parking_id: parkingId,
          slot_number: slot.slot_number,
          vehicle_type: slot.vehicle_type,
          is_available: slot.is_available
        }
      })),
      prisma.parking.update({
        where: { parking_id: parkingId },
        data: {
          total_slots: { increment: slotsData.length }
        }
      })
    ]);
  }
  
  async updateParking(parkingId, updateData) {
    // Hapus available_slots jika ada di updateData
    const { available_slots, ...data } = updateData;
    return await prisma.parking.update({
      where: { parking_id: parkingId },
      data
    });
  }
  
  async getParkingByName(name) {
    return await prisma.parking.findFirst({
      where: { name }
    });
  }

  async getParkingWithRelations(parkingId) {
    return await prisma.parking.findUnique({
      where: { parking_id: parkingId },
      include: {
        slots: true,
        staff_members: true
      }
    });
  }

  async deleteParking(parkingId) {
    return await prisma.$transaction([
      prisma.slot.deleteMany({
        where: { parking_id: parkingId }
      }),
      prisma.parking.delete({
        where: { parking_id: parkingId }
      })
    ]);
  }
}

module.exports = new ParkingRepository();
