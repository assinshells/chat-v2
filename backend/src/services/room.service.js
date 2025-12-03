// ==========================================
// src/services/room.service.js
// ==========================================
import Room from "../models/Room.model.js";
import { DEFAULT_ROOMS } from "../constants/index.js";

class RoomService {
  async initializeDefaultRooms() {
    for (const room of DEFAULT_ROOMS) {
      await Room.findOneAndUpdate({ name: room.name }, room, {
        upsert: true,
        new: true,
      });
    }
  }

  async getAllRooms() {
    return Room.find().sort({ name: 1 }).lean();
  }
}

export default new RoomService();
