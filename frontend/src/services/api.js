import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/complaints"
});

export const sendComplaint = (text) => API.post("/", { text });
export const getComplaints = () => API.get("/");