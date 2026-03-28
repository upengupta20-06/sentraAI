import React, { useState } from "react";
import { sendComplaint } from "../services/api";

export default function ComplaintForm({ refresh, onNewComplaint }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await sendComplaint(text);
      setText("");
      // Immediately add to dashboard if we got a response
      if (response.data && onNewComplaint) {
        onNewComplaint(response.data);
      }
      refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Backend may not be running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{
      maxWidth: "600px",
      margin: "40px auto",
      padding: "36px",
    }}>
      <h2 style={{ fontSize: "1.75rem", marginBottom: "8px" }}>Submit a Complaint</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: "1rem", lineHeight: "1.6" }}>
        Tell us what's on your mind. Our AI will analyze, categorize, and prioritize your concern instantly.
      </p>

      <div style={{ marginBottom: "24px" }}>
        <textarea
          rows="6"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "20px",
            borderRadius: "16px",
            fontSize: "1.1rem",
            resize: "none",
            backgroundColor: "rgba(255,255,255,0.5)"
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe your issue in detail..."
          disabled={loading}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
        style={{
          width: "100%",
          padding: "18px",
          background: text.trim() 
            ? "linear-gradient(135deg, #3b82f6, #2563eb)" 
            : "#e2e8f0",
          color: text.trim() ? "white" : "#64748b",
          border: "none",
          borderRadius: "14px",
          fontSize: "1.1rem",
          fontWeight: "800",
          opacity: loading ? 0.7 : 1,
          display: "block",
          marginTop: "12px",
          boxShadow: text.trim() ? "0 4px 16px rgba(59, 130, 246, 0.4)" : "none",
          cursor: text.trim() ? "pointer" : "not-allowed",
          transition: "all 0.3s ease"
        }}
      >
        {loading ? "AI Processing..." : "Send to SentraAI"}
      </button>
    </div>
  );
}