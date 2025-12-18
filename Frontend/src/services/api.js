/*import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // ya jahan tera backend hai
  headers: {
    "Content-Type": "application/json",
  },
  // agar future me token use karna h ho, toh yahan interceptors ya headers set kar sakte ho
});

// Optional: response / request interceptors for auth token etc.
// api.interceptors.request.use(config => { ... });

export default api;*/

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    // 🔁 agar redux use kar rahe ho to wahan se lo

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
