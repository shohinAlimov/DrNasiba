import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Your back-end server URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Save or update account details
export const saveAccountDetails = (data: any) => {
  const token = localStorage.getItem("authToken");
  return api.post("/api/account", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get account details
export const getAccountDetails = () => {
  return api.get("/api/account", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Pass the token
    },
  });
};



export default api;
