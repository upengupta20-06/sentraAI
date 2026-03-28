// database.js



const mongoose = require("mongoose");

const dns = require("dns");



// 🌐 Mandatory DNS bypass for SRV record issues with local ISPs

dns.setServers(['8.8.8.8', '1.1.1.1']);



const connectDB = async () => {

  try {

    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {

      console.error("No MONGO_URI in environment variables!");

      return;

    }

    const maskedURI = mongoURI.replace(/:([^@]+)@/, ":****@");

    console.log(`Connecting to MongoDB at ${maskedURI}... ⏳`);

    await mongoose.connect(mongoURI);



    console.log("MongoDB Connected ✅");

  } catch (error) {

    console.error("MongoDB Connection Error ❌:", error.message);

    console.log("Tip: Make sure MongoDB is running locally or check your MONGO_URI in .env file.");

  }

};



module.exports = connectDB;