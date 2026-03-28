require("dotenv").config();
const mongoose = require("mongoose");
const Complaint = require("../models/complaint");

const clearDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    
    const result = await Complaint.deleteMany({});
    console.log(`Deleted ${result.deletedCount} old complaints. Database is now clean! ✨`);
    
    process.exit(0);
  } catch (err) {
    console.error("Error clearing database:", err.message);
    process.exit(1);
  }
};

clearDB();
