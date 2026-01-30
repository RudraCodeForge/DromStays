import { useEffect, useState } from "react";
import { DashboardPayments } from "../services/Payment.service";

export const useDashboardPayments = (ownerId) => {
  const [data, setData] = useState({
    advanceBalance: 0,
    expectedCollection: 0,
    overdueAmount: 0,
    month: '',
  });

  useEffect(() => {
    if (!ownerId) return;

    DashboardPayments(ownerId)
      .then((res) => setData(res.data))
      .catch(console.error);

  }, [ownerId]);
  return data;
};
