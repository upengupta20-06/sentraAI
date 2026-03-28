// controllers/complaintController.js

const Complaint = require("../models/complaint");

// AI modules
const { analyzeSentiment } = require("../ai/sentiment");
const { categorize } = require("../ai/categorization");
const { findSimilar } = require("../ai/similarity");
const { generateResponse } = require("../ai/genai");

// SLA utils
const {
  calculateSLA,
  assignPriority,
  escalateIfNeeded
} = require("../utils/slaManager");


// ✅ CREATE COMPLAINT (MAIN FUNCTION)
exports.createComplaint = async (req, res) => {
  try {
    const { text } = req.body;
    console.log("📥 New complaint request received:", text);

    if (!text) {
      return res.status(400).json({ error: "Complaint text is required" });
    }

    // 🧠 AI processing
    const sentiment = await analyzeSentiment(text);
    const category = categorize(text);

    // get existing complaints for similarity
    const existingComplaints = await Complaint.find();

    const similar = await findSimilar(text, existingComplaints);

    const aiResponse = await generateResponse(text);

    // ⏱️ SLA + Priority
    const slaDeadline = calculateSLA(category);
    const priority = assignPriority(sentiment);

    // 🗄️ Create complaint
    let complaint = new Complaint({
      text,
      sentiment,
      category,
      similar,
      aiResponse,
      slaDeadline,
      priority,
      history: [
        {
          message: text,
          sender: "User"
        }
      ]
    });

    // 🚨 Escalation check
    complaint = escalateIfNeeded(complaint);

    await complaint.save();

    res.status(201).json(complaint);

  } catch (error) {
    console.error("Create Complaint Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};



// ✅ GET ALL COMPLAINTS (FOR DASHBOARD)
exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });

    res.json(complaints);

  } catch (error) {
    console.error("Get Complaints Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};



// ✅ GET SINGLE COMPLAINT (360° VIEW)
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json(complaint);

  } catch (error) {
    console.error("Get Single Complaint Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};



// ✅ UPDATE STATUS (FOR AGENT ACTIONS)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    complaint.status = status;

    // add to history
    complaint.history.push({
      message: `Status changed to ${status}`,
      sender: "Agent"
    });

    await complaint.save();

    res.json(complaint);

  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};