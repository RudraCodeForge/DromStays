import { useEffect, useState } from "react";
import { GetTenantCount } from "../services/Tenant.service";

export const useActiveBookings = () => {
    const [data, setData] = useState({
        activeBookings: 0,
    });

    useEffect(() => {
        const fetchActiveBookings = async () => {
            try {
                const response = await GetTenantCount();

                setData({
                    activeBookings: response.count, // ✅ backend match
                });
            } catch (error) {
                console.error("Error fetching active bookings:", error);
            }
        };

        fetchActiveBookings();
    }, []);

    return data;
};
