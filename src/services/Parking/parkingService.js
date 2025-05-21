// src/services/Parking/parkingService.js

const parkingRepository = require('../../repositories/Parking/parkingRepository')
const { validateParkingInput, validateSlotInput } = require('../../utils/helpers/parkingHelpers')

class ParkingService {
  async getAllParkings() {
    return await parkingRepository.getAllActiveParkings()
  }

  async getParkingDetails(parkingId) {
    const parking = await parkingRepository.getParkingById(parkingId)
    if (!parking) {
      throw new Error('Parking not found')
    }
    return parking
  }

  async getAvailableSlots(parkingId, vehicleType) {
    if (!['car', 'motorcycle', 'bicycle'].includes(vehicleType)) {
      throw new Error('Invalid vehicle type')
    }
    return await parkingRepository.getAvailableSlotsByType(parkingId, vehicleType)
  }

  async createParking(parkingData) {
    const validation = validateParkingInput(parkingData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Create parking first
    const parking = await parkingRepository.createParking({
      ...parkingData,
      available_slots: parkingData.total_slots // Initially all slots are available
    });

    // Generate slots automatically
    const slotsToCreate = Array.from({ length: parkingData.total_slots }, (_, i) => ({
      slot_number: i + 1,
      vehicle_type: 'car', // Default vehicle type
      is_available: true
    }));

    await parkingRepository.createSlots(parking.parking_id, slotsToCreate);

    return parking;
  }

  async addSlotsToParking(parkingId, slotsData) {
    const parking = await parkingRepository.getParkingById(parkingId)
    if (!parking) {
      throw new Error('Parking not found')
    }

    // Validate all slots
    for (const slot of slotsData) {
      const validation = validateSlotInput(slot)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }
    }

    return await parkingRepository.createSlots(parkingId, slotsData)
  }

  async updateParking(parkingId, updateData) {
    const parking = await parkingRepository.getParkingById(parkingId)
    if (!parking) {
      throw new Error('Parking not found')
    }

    const validation = validateParkingInput(updateData)
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '))
    }

    return await parkingRepository.updateParking(parkingId, updateData)
  }

  async deleteParking(parkingId) {
    const parking = await parkingRepository.getParkingById(parkingId)
    if (!parking) {
      throw new Error('Parking not found')
    }

    return await parkingRepository.deleteParking(parkingId)
  }

  async addSlotToParking(parkingId, slotData) {
    const parking = await parkingRepository.getParkingById(parkingId)
    if (!parking) {
      throw new Error('Parking not found')
    }

    const validation = validateSlotInput(slotData)
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '))
    }

    return await parkingRepository.createSlot({
      parking_id: parkingId,
      slot_code: slotData.slot_code,
      vehicle_type: slotData.vehicle_type || 'car',
      is_available: true
    })
  }

}

module.exports = new ParkingService()