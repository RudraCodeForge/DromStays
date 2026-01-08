import { useEffect, useState } from "react";
import { Get_Owner_Rooms } from "../services/Rooms.service";

const ONE_DAY = 24 * 60 * 60 * 1000;

export const useOwnerRooms = () => {
  const [rooms, setRooms] = useState(0);
  const [newRooms, setNewRooms] = useState(0);

  useEffect(() => {
    const fetchRooms = async () => {
      const data = await Get_Owner_Rooms();
      const count = data?.rooms?.length || 0;

      const prev = Number(localStorage.getItem("owner_rooms_count")) || 0;
      const badge = JSON.parse(localStorage.getItem("owner_rooms_badge"));
      const now = Date.now();

      if (badge && now - badge.timestamp > ONE_DAY) {
        localStorage.removeItem("owner_rooms_badge");
      }

      if (count > prev) {
        const diff = count - prev;
        localStorage.setItem(
          "owner_rooms_badge",
          JSON.stringify({ count: diff, timestamp: now })
        );
        setNewRooms(diff);
      } else if (badge) {
        setNewRooms(badge.count);
      }

      setRooms(count);
      localStorage.setItem("owner_rooms_count", count);
    };

    fetchRooms();
  }, []);

  return { rooms, newRooms };
};
