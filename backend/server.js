require("dotenv").config();



const express = require("express");

const cors = require("cors");

const http = require("http");

const { Server } = require("socket.io");



const connectDB = require("./database");



const app = express();

const server = http.createServer(app);

const io = new Server(server, {

  cors: {

    origin: "*",

    methods: ["GET", "POST"]

  }

});



// ✅ CONNECT DATABASE

connectDB();



app.use(cors({ origin: true })); // Allow all origins explicitly

app.use(express.json());



// 📝 Simple Request Logger

app.use((req, res, next) => {

  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);

  next();

});



// WebSocket connection handling

io.on('connection', (socket) => {

  console.log('🔌 Client connected:', socket.id);

  

  socket.on('disconnect', () => {

    console.log('🔌 Client disconnected:', socket.id);

  });

  

  socket.on('join-dashboard', () => {

    socket.join('dashboard');

    console.log('📊 Client joined dashboard room');

  });

});



// Make io available to routes

app.set('io', io);



// routes

const complaintRoutes = require("./routes/complaintRoutes");

app.use("/api/complaints", complaintRoutes);



// start server

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(`Server running on port ${PORT} 🚀`);

  console.log(`WebSocket server ready for real-time updates`);

});