import { useEffect, useState } from "react";
import { Get_All_Activities } from "../services/RecentActivity.service";

export const useRecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Get_All_Activities()
      .then((res) => setActivities(res.activities || []))
      .finally(() => setLoading(false));
  }, []);

  return { activities, loading };
};
