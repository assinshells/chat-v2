// frontend/src/hooks/useRooms.js
import { useState, useCallback, useEffect } from "react";
import { usersApi } from "../api/users.api";

export const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRooms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await usersApi.getRooms();
      setRooms(
        data.map((room) => ({
          ...room,
          userCount: room.userCount || 0,
          users: room.users || [],
        }))
      );
    } catch (err) {
      console.error("Error loading rooms:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const getRoomByName = useCallback(
    (roomName) => {
      return rooms.find((r) => r.name === roomName);
    },
    [rooms]
  );

  const getRoomUsers = useCallback(
    (roomName) => {
      const room = getRoomByName(roomName);
      return room?.users || [];
    },
    [getRoomByName]
  );

  return {
    rooms,
    loading,
    error,
    loadRooms,
    getRoomByName,
    getRoomUsers,
  };
};
