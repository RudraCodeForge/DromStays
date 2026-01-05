import api from "./api";

export const getReviews = async () => {
  try {
    const res = await api.get("/reviews/Get_Reviews");
    return res.data;
  } catch (err) {
    console.error("Error fetching reviews:", err);
    throw err;
  }
};

export const submitReview = async (reviewData) => {
  try {
    const res = await api.post("/reviews/Submit_Reviews", reviewData);
    return res.data;
  } catch (err) {
    console.error("Error submitting review:", err);
    throw err;
  }
};
