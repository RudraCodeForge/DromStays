import { useEffect, useState } from "react";
import { Get_Pending_Requests_Count } from "../services/Request.service";

export const useRequests = () => {
    const [data, setData] = useState({ pendingRequestsCount: 0 });

    useEffect(() => {
        const fetchPendingRequestsCount = async () => {
            try {
                const response = await Get_Pending_Requests_Count();

                setData({
                    pendingRequestsCount: response.pendingCount, // ✅ FIX
                });
            } catch (error) {
                console.error("Error fetching pending requests count:", error);
            }
        };

        fetchPendingRequestsCount();
    }, []);

    return data;
};
