require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./database");

const app = express();

// ✅ CONNECT DATABASE
connectDB();

app.use(cors());
app.use(express.json());

// routes
const complaintRoutes = require("./routes/complaintRoutes");
app.use("/api/complaints", complaintRoutes);

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});