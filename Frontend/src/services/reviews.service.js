import api from "./api.service";
import handleServerError from "../Helper/ServerErrorhelper";
import handleAuthError from "../Helper/AuthErrorHelper";

/* ================= GET REVIEWS ================= */
export const getReviews = async () => {
  try {
    const res = await api.get("/reviews/Get_Reviews");
    return res.data;
  } catch (error) {
    //if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to fetch reviews",
    };
  }
};

/* ================= SUBMIT REVIEW ================= */
export const submitReview = async (reviewData) => {
  try {
    const res = await api.post("/reviews/Submit_Reviews", reviewData);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to submit review",
    };
  }
};
