import React, { useState } from "react";
import { sendComplaint } from "../services/api";

export default function ComplaintForm({ refresh }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      await sendComplaint(text);
      setText("");
      refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Is the backend running and MongoDB connected?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "40px auto",
      padding: "30px",
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
      border: "1px solid #f1f5f9"
    }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>Send a Complaint</h2>
      <p style={{ color: "#64748b", marginBottom: "24px", fontSize: "0.95rem" }}>
        Tell us what's on your mind. Our AI will analyze and categorize it.
      </p>

      <div style={{ marginBottom: "20px" }}>
        <textarea
          rows="5"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "16px",
            borderRadius: "12px",
            border: "2px solid #e2e8f0",
            fontSize: "1rem",
            resize: "none"
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I have an issue with..."
          disabled={loading}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
        style={{
          width: "100%",
          padding: "14px",
          backgroundColor: text.trim() ? "#6366f1" : "#94a3b8",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontSize: "1rem",
          fontWeight: "600",
          opacity: loading ? 0.7 : 1,
          transform: loading ? "none" : ""
        }}
      >
        {loading ? "Processing..." : "Submit Complaint"}
      </button>
    </div>
  );
}