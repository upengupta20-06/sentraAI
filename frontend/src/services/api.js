import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const sendComplaint = (text) => API.post("/complaints", { text });
export const getComplaints = () => API.get("/complaints");
export const updateComplaintStatus = (id, status) => API.put(`/${id}`, { status });