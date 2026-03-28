const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  
  // Main complaint text
  text: {
    type: String,
    required: true
  },

  
  // AI deep analysis
  sentiment: String,
  category: String,
  product: String,
  severity: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    default: "Medium"
  },
  rootCause: String,
  regulatoryFlag: {
    type: Boolean,
    default: false
  },
  nextBestAction: String,

  //  Duplicate / similar complaints
  similar: [
    {
      text: String,
      score: Number
    }
  ],

  //  AI-generated response
  aiResponse: String,

  //  Status tracking
  status: {
    type: String,
    enum: ["Open", "In Progress", "Resolved", "Escalated", "Regulatory Review"],
    default: "Open"
  },

  //  Priority
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    default: "Medium"
  },

  // ⏱ SLA fields
  slaDeadline: Date,
  escalated: {
    type: Boolean,
    default: false
  },

  //  Full communication history (360° view)
  history: [
    {
      message: String,
      sender: {
        type: String,
        enum: ["User", "Agent", "System", "Legal"],
        default: "User"
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],


  //  timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", ComplaintSchema);