// ==========================================
// src/controllers/room.controller.js
// ==========================================
import roomService from "../services/room.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class RoomController {
  getAllRooms = asyncHandler(async (req, res) => {
    const rooms = await roomService.getAllRooms();
    res.json(rooms);
  });
}

export default new RoomController();
