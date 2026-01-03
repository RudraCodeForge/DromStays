import api from "./api";

export const Add_Property = async (propertyData) => {
  try {
    const response = await api.post("/properties/add", propertyData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { success: false, message: "Server error" };
  }
};

export const Get_Owner_Properties = async () => {
  try {
    const response = await api.get("/properties/owner_properties");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { success: false, message: "Server error" };
  }
};

export const Get_Property_By_Id = async (propertyId) => {
  try {
    const response = await api.get(`/properties/${propertyId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { success: false, message: "Server error" };
  }
};
