require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./database");

const app = express();

// ✅ CONNECT DATABASE
connectDB();

app.use(cors({ origin: true })); // Allow all origins explicitly
app.use(express.json());

// 📝 Simple Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// routes
const complaintRoutes = require("./routes/complaintRoutes");
app.use("/api/complaints", complaintRoutes);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});