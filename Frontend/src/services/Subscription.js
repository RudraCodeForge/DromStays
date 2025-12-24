import api from "./api";

export const getSubscriptionPlans = async () => {
  try {
    const response = await api.get("/subscriptions/Get_Subscriptions");
    return response.data.plans;
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    throw error;
  }
};
