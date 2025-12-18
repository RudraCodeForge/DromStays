import api from "./api";

export const getReviews = async () => {
  try {
    const res = await api.get("/reviews");
    return res.data;
  } catch (err) {
    console.error("Error fetching reviews:", err);
    throw err;
  }
};
