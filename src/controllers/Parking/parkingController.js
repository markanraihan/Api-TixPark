// src/controllers/Parking/parkingController.js

const parkingService = require('../../services/Parking/parkingService')

class ParkingController {
  async getAllParkings(req, res) {
    try {
      const parkings = await parkingService.getAllParkings()
      res.json(parkings)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async getParkingDetails(req, res) {
    try {
      const parking = await parkingService.getParkingDetails(req.params.parkingId)
      res.json(parking)
    } catch (error) {
      res.status(404).json({ error: error.message })
    }
  }

  async getAvailableSlots(req, res) {
    try {
      const slots = await parkingService.getAvailableSlots(
        req.params.parkingId,
        req.query.vehicleType || 'car' // Default to car
      )
      res.json(slots)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  async createParking(req, res) {
    try {
      const parkingData = req.body
      const newParking = await parkingService.createParking(parkingData)
      res.status(201).json(newParking)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  async addSlotToParking(req, res) { 
    try {
      const { parkingId } = req.params
      const slotData = req.body
      const newSlot = await parkingService.addSlotToParking(parkingId, slotData)
      res.status(201).json(newSlot)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  async updateParking(req, res) {
    try {
      const { parkingId } = req.params
      const updateData = req.body
      const updatedParking = await parkingService.updateParking(parkingId, updateData)
      res.json(updatedParking)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  async deleteParking(req, res) {
    try {
      const { parkingId } = req.params
      await parkingService.deleteParking(parkingId)
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = new ParkingController()