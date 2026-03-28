// controllers/complaintController.js



const Complaint = require("../models/complaint");



// AI modules

const { analyzeSentiment } = require("../ai/sentiment");

const { analyzeDeeply } = require("../ai/deepAnalysis");

const { findSimilar } = require("../ai/similarity");

const { generateResponse } = require("../ai/genai");



// SLA utils

const {

  calculateSLA,

  assignPriority,

  escalateIfNeeded

} = require("../utils/slaManager");



// Analytics helper functions

function generateCategoryStats(complaints) {

  const stats = {};

  complaints.forEach(c => {

    stats[c.category] = (stats[c.category] || 0) + 1;

  });

  return stats;

}



function generateSeverityStats(complaints) {

  const stats = { Low: 0, Medium: 0, High: 0, Critical: 0 };

  complaints.forEach(c => {

    if (stats.hasOwnProperty(c.severity)) {

      stats[c.severity]++;

    }

  });

  return stats;

}



function generateSentimentStats(complaints) {

  const stats = { Positive: 0, Neutral: 0, Negative: 0 };

  complaints.forEach(c => {

    if (stats.hasOwnProperty(c.sentiment)) {

      stats[c.sentiment]++;

    }

  });

  return stats;

}



// CREATE COMPLAINT (MAIN FUNCTION)

exports.createComplaint = async (req, res) => {

  try {

    const { text } = req.body;

    console.log("New complaint request received:", text);



    if (!text) {

      return res.status(400).json({ error: "Complaint text is required" });

    }



    // AI high-level processing

    const sentiment = await analyzeSentiment(text);

    

    // Deep Insights

    const { category, product, severity, rootCause, regulatoryFlag, nextBestAction } = await analyzeDeeply(text);



    // get existing complaints for similarity

    let existingComplaints = [];

    try {

      existingComplaints = await Complaint.find();

    } catch (dbError) {

      console.log("Database not available, continuing without similarity check");

    }



    const similar = await findSimilar(text, existingComplaints);



    const aiResponse = await generateResponse(text);



    // SLA + Priority

    const slaDeadline = calculateSLA(category);

    const priority = severity === "Critical" ? "Critical" : assignPriority(sentiment);



    // Create complaint object

    let complaint = {

      text,

      sentiment,

      category,

      product,

      severity,

      rootCause,

      regulatoryFlag,

      nextBestAction,

      similar,

      aiResponse,

      slaDeadline,

      priority,

      status: regulatoryFlag ? "Regulatory Review" : "Open",

      history: [{ message: text, sender: "User" }],

      createdAt: new Date()

    };



    // Escalation check

    complaint = escalateIfNeeded(complaint);



    // Try to save to database, but continue if it fails

    let savedComplaint = complaint;

    try {

      const complaintModel = new Complaint(complaint);

      savedComplaint = await complaintModel.save();

      

      // Real-time WebSocket update

      const io = req.app.get('io');

      if (io) {

        io.to('dashboard').emit('new-complaint', {

          id: savedComplaint._id,

          text: savedComplaint.text,

          category: savedComplaint.category,

          severity: savedComplaint.severity,

          sentiment: savedComplaint.sentiment,

          priority: savedComplaint.priority,

          createdAt: savedComplaint.createdAt,

          similar: savedComplaint.similar.length

        });

        

        // Emit analytics update

        const allComplaints = await Complaint.find();

        io.to('dashboard').emit('analytics-update', {

          total: allComplaints.length,

          byCategory: generateCategoryStats(allComplaints),

          bySeverity: generateSeverityStats(allComplaints),

          bySentiment: generateSentimentStats(allComplaints)

        });

      }

    } catch (dbError) {

      console.log("Database save failed, returning complaint without persistence");

    }



    res.status(201).json(savedComplaint);



  } catch (error) {

    console.error("Create Complaint Error:", error);

    res.status(500).json({ error: "Server Error", details: error.message });

  }

};







// GET ALL COMPLAINTS (FOR DASHBOARD)

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