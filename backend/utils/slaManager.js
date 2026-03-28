// utils/slaManager.js

// 🎯 Set SLA based on category
function calculateSLA(category) {
  const now = new Date();

  let hours;

  switch (category) {
    case "Payment Issue":
      hours = 12; // urgent
      break;
    case "Delivery Issue":
      hours = 24;
      break;
    case "Auth Issue":
      hours = 6;
      break;
    default:
      hours = 48;
  }

  const deadline = new Date(now.getTime() + hours * 60 * 60 * 1000);

  return deadline;
}

// 🎯 Assign priority based on sentiment
function assignPriority(sentiment) {
  if (sentiment === "NEGATIVE") return "High";
  if (sentiment === "NEUTRAL") return "Medium";
  return "Low";
}

// 🎯 Check if SLA is breached
function checkSLAStatus(complaint) {
  const now = new Date();

  if (!complaint.slaDeadline) return "No SLA";

  if (now > complaint.slaDeadline && complaint.status !== "Resolved") {
    return "Breached";
  }

  return "Within SLA";
}

// 🎯 Escalation logic
function escalateIfNeeded(complaint) {
  const status = checkSLAStatus(complaint);

  if (status === "Breached") {
    complaint.priority = "Critical";
    complaint.escalated = true;
  }

  return complaint;
}

module.exports = {
  calculateSLA,
  assignPriority,
  checkSLAStatus,
  escalateIfNeeded
};