import React, { useEffect, useState } from "react";
import { getComplaints } from "../services/api";

const Badge = ({ children, color }) => (
  <span style={{
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "700",
    backgroundColor: color + "1a", // very low opacity
    color: color,
    marginRight: "6px"
  }}>
    {children}
  </span>
);

const PriorityBadge = ({ priority }) => {
  let color = "#3b82f6"; // blue
  if (priority === "High" || priority === "Critical") color = "#ef4444"; // red
  if (priority === "Medium") color = "#f59e0b"; // yellow
  return <Badge color={color}>{priority}</Badge>;
};

const SentimentBadge = ({ sentiment }) => {
  let color = "#10b981"; // green
  if (sentiment === "NEGATIVE") color = "#ef4444"; // red
  if (sentiment === "NEUTRAL") color = "#6b7280"; // gray
  return <Badge color={color}>{sentiment}</Badge>;
};

export default function Dashboard({ refresh }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await getComplaints();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  if (loading) return <p style={{ textAlign: "center", color: "#64748b" }}>Loading Dashboard...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", paddingBottom: "100px" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "32px", textAlign: "center" }}>Support Dashboard</h2>

      {data.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px",
          backgroundColor: "#f1f5f9",
          borderRadius: "24px",
          color: "#94a3b8"
        }}>
          <p>No complaints submitted yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {data.map((c, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "white",
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                 <div style={{ display: "flex", gap: "8px" }}>
                    <PriorityBadge priority={c.priority} />
                    <SentimentBadge sentiment={c.sentiment} />
                    <Badge color="#6366f1">{c.category || "General"}</Badge>
                 </div>
                 <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                   {new Date(c.createdAt).toLocaleDateString()}
                 </span>
              </div>

              <p style={{
                fontSize: "1.1rem",
                fontWeight: "500",
                margin: "0 0 16px 0",
                lineHeight: "1.5",
                color: "#1e293b"
              }}>
                {c.text}
              </p>

              <div style={{
                backgroundColor: "#f8fafc",
                padding: "16px",
                borderRadius: "12px",
                borderLeft: "4px solid #6366f1",
                fontSize: "0.95rem"
              }}>
                <p style={{ margin: "0 0 8px 0", color: "#6366f1", fontWeight: "700", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>AI SUGGESTED RESOLUTION</p>
                <p style={{ margin: 0, color: "#475569" }}>{c.aiResponse || "Pending analysis..."}</p>
              </div>

              <div style={{ marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                 <span style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: c.status === "Resolved" ? "#10b981" : "#f59e0b"
                 }}>
                   STATUS: {c.status}
                 </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}