import axios from "axios";

const API_BASE = "http://localhost:8000";

export const fetchDashboardData = async () => {
  const response = await axios.get(`${API_BASE}/dashboard`);
  return response.data;
};