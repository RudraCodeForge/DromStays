import api from "./api.service";
import handleServerError from "../Helper/ServerErrorhelper";
import handleAuthError from "../Helper/AuthErrorHelper";

/* ================= ADD PROPERTY ================= */
export const Add_Property = async (propertyData) => {
  try {
    const res = await api.post("/properties/add", propertyData);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;
    throw error.response?.data;
  }
};

/* ================= GET OWNER PROPERTIES ================= */
export const Get_Owner_Properties = async () => {
  try {
    const res = await api.get("/properties/owner_properties");
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;
    throw error.response?.data;
  }
};

/* ================= GET PROPERTY BY ID ================= */
export const Get_Property_By_Id = async (propertyId) => {
  try {
    const res = await api.get(`/properties/${propertyId}`);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;
    throw error.response?.data;
  }
};

/* ================= UPDATE PROPERTY ================= */
export const Update_Property = async (propertyId, propertyData) => {
  try {
    const res = await api.put(
      `/properties/update/${propertyId}`,
      propertyData
    );
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;
    throw error.response?.data;
  }
};

/* ================= DELETE PROPERTY ================= */
export const Delete_Property = async (propertyId) => {
  try {
    const res = await api.delete(`/properties/delete/${propertyId}`);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;
    throw error.response?.data;
  }
};

/* ================= GET ALL PROPERTIES ================= */
export const Get_All_Properties = async () => {
  try {
    const res = await api.get("/properties/all_properties");
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;
    throw error.response?.data;
  }
};

/* ================= SEARCH PROPERTIES ================= */
export const Search_Properties = async (queryParams) => {
  try {
    const res = await api.get("/properties/search", {
      params: queryParams,
    });
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;
    throw error.response?.data;
  }
};
