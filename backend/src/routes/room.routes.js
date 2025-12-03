// ==========================================
// src/routes/room.routes.js
// ==========================================
import express from "express";
import roomController from "../controllers/room.controller.js";

const router = express.Router();

router.get("/", roomController.getAllRooms);

export default router;
