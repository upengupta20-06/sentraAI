import React, { useEffect, useState } from "react";
import { getComplaints, updateComplaintStatus } from "../services/api";
import AnalyticsChart from "./AnalyticsChart";

const Badge = ({ children, color }) => (
  <span style={{
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "700",
    backgroundColor: color + "1a",
    color: color,
    marginRight: "6px",
    backdropFilter: "blur(10px)",
    border: `1px solid ${color}40`
  }}>
    {children}
  </span>
);

const PriorityBadge = ({ priority }) => {
  let color = "#3b82f6";
  if (priority === "High" || priority === "Critical") color = "#ef4444";
  if (priority === "Medium") color = "#f59e0b";
  return <Badge color={color}>{priority}</Badge>;
};

const SentimentBadge = ({ sentiment }) => {
  let color = "#10b981";
  if (sentiment === "NEGATIVE") color = "#ef4444";
  if (sentiment === "NEUTRAL") color = "#6b7280";
  return <Badge color={color}>{sentiment}</Badge>;
};

export default function Dashboard({ refresh, complaints: externalComplaints, setComplaints }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getComplaints();
      // Merge external complaints with fetched data
      const merged = [...externalComplaints, ...res.data.filter(fetched => 
        !externalComplaints.some(ext => ext._id === fetched._id || ext.id === fetched.id)
      )];
      setData(merged);
    } catch (err) {
      console.error(err);
      // If fetch fails, at least show external complaints
      setData(externalComplaints);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // WebSocket connection for real-time updates
    const ws = new WebSocket('ws://localhost:5000');
    
    ws.onopen = () => {
      console.log('🔌 Connected to real-time updates');
      ws.send(JSON.stringify({ type: 'join-dashboard' }));
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'new-complaint') {
        setRealTimeUpdates(prev => [message, ...prev].slice(0, 5));
        setData(prev => [message, ...prev]);
      }
      
      if (message.type === 'analytics-update') {
        setAnalytics(message.data);
      }
    };
    
    ws.onerror = (error) => {
      console.log('WebSocket error, falling back to polling');
    };
    
    return () => {
      ws.close();
    };
  }, [refresh, externalComplaints]);

  if (loading) return (
    <div style={{ 
      textAlign: "center", 
      color: "var(--text-secondary)", 
      marginTop: "100px",
      fontSize: "1.2rem",
      fontWeight: "600"
    }}>
      <div style={{
        display: "inline-block",
        width: "40px",
        height: "40px",
        border: "4px solid var(--accent)",
        borderTop: "4px solid transparent",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "20px"
      }}></div>
      <br />
      AI Intelligence Loading...
    </div>
  );

  // Stats calculation - recalculate when data changes
  const stats = {
    total: data.length,
    critical: data.filter(c => c.priority === "Critical" || c.severity === "Critical").length,
    regulatory: data.filter(c => c.regulatoryFlag).length,
    avgSentiment: data.length > 0 
      ? Math.round((data.filter(c => c.sentiment === "POSITIVE" || c.sentiment === "Positive").length / data.length) * 100)
      : 0
  };

  // Analytics helper functions
  const generateCategoryStats = (complaints) => {
    const stats = {};
    complaints.forEach(c => {
      stats[c.category || 'General'] = (stats[c.category || 'General'] || 0) + 1;
    });
    return stats;
  };

  const generateSeverityStats = (complaints) => {
    const stats = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    complaints.forEach(c => {
      if (stats.hasOwnProperty(c.severity)) {
        stats[c.severity]++;
      }
    });
    return stats;
  };

  const generateSentimentStats = (complaints) => {
    const stats = { Positive: 0, Neutral: 0, Negative: 0 };
    complaints.forEach(c => {
      if (stats.hasOwnProperty(c.sentiment)) {
        stats[c.sentiment]++;
      }
    });
    return stats;
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "60px auto", padding: "0 20px 120px" }}>
      
      {/* 📊 Analytics Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "60px" }}>
        {[
          { label: "TOTAL COMPLAINTS", value: stats.total, color: "#3b82f6" },
          { label: "CRITICAL ISSUES", value: stats.critical, color: "#ef4444" },
          { label: "REGULATORY RISKS", value: stats.regulatory, color: "#dc2626" },
          { label: "POSITIVE INDEX", value: `${stats.avgSentiment}%`, color: "#10b981" }
        ].map((stat, i) => (
          <div 
            key={i}
            className="glass-card" 
            style={{ 
              padding: "24px", 
              textAlign: "center",
              background: `linear-gradient(135deg, ${stat.color}10, ${stat.color}05)`,
              border: `1px solid ${stat.color}30`,
              animation: `fadeInUp 0.8s ease-out ${i * 0.1}s both`
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "8px", fontWeight: "bold", color: stat.color }}>●</div>
            <p style={{ margin: 0, fontSize: "2rem", fontWeight: "900", color: stat.color }}>{stat.value}</p>
            <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: "700", opacity: 0.7 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Real-time Updates Feed */}
      {realTimeUpdates.length > 0 && (
        <div className="glass-card" style={{ 
          marginBottom: "40px", 
          padding: "20px",
          background: "linear-gradient(135deg, #10b98110, #10b98105)",
          border: "1px solid #10b98130"
        }}>
          <h3 style={{ margin: "0 0 16px 0", color: "#10b981", fontSize: "1.1rem", fontWeight: "800" }}>
            LIVE COMPLAINT FEED
          </h3>
          {realTimeUpdates.map((update, i) => (
            <div key={i} style={{
              padding: "12px",
              background: "rgba(16, 185, 129, 0.05)",
              borderRadius: "8px",
              marginBottom: "8px",
              fontSize: "0.9rem",
              color: "var(--text-secondary)"
            }}>
              <strong>{update.category}</strong> - {update.text.substring(0, 80)}...
              <span style={{ float: "right", fontSize: "0.8rem", opacity: 0.6 }}>
                {new Date(update.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 📊 Analytics Charts */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3, 1fr)", 
        gap: "24px", 
        marginBottom: "60px" 
      }}>
        <AnalyticsChart 
          title="Complaints by Category" 
          data={generateCategoryStats(data)} 
        />
        <AnalyticsChart 
          title="Severity Distribution" 
          data={generateSeverityStats(data)} 
        />
        <AnalyticsChart 
          title="Sentiment Analysis" 
          data={generateSentimentStats(data)} 
        />
      </div>

      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "48px" 
      }}>
        <h2 style={{ fontSize: "2.2rem", margin: 0, fontWeight: "900" }}>360° Complaint Intelligence</h2>
        <div style={{
          padding: "8px 16px",
          background: "linear-gradient(135deg, #10b98120, #10b98110)",
          color: "#10b981",
          borderRadius: "100px",
          fontSize: "0.85rem",
          fontWeight: "800",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          border: "1px solid #10b98140",
          backdropFilter: "blur(10px)"
        }}>
          <span style={{ 
            width: "10px", 
            height: "10px", 
            backgroundColor: "#10b981", 
            borderRadius: "50%", 
            animation: "pulse 1.5s infinite" 
          }}></span>
          GEN-AI ACTIVE
        </div>
      </div>

      {data.length === 0 ? (
        <div className="glass-card" style={{
          textAlign: "center",
          padding: "100px",
          color: "var(--text-muted)",
          background: "linear-gradient(135deg, #6366f110, #6366f105)"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px", color: "#3b82f6", fontWeight: "bold" }}>AI</div>
          <p style={{ fontSize: "1.2rem", fontWeight: "600" }}>AI systems on standby. No active complaints detected.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }}>
          {data.map((c, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                padding: "40px",
                transition: "all 0.3s ease",
                borderLeft: c.priority === "Critical" ? "4px solid #ef4444" : "1px solid rgba(99, 102, 241, 0.3)",
                background: c.priority === "Critical" 
                  ? "linear-gradient(135deg, #ef444410, #ef444405)" 
                  : "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(99, 102, 241, 0.02))",
                animation: `fadeInUp 0.8s ease-out ${i * 0.1}s both`
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", alignItems: "flex-start" }}>
                 <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                    <PriorityBadge priority={c.priority} />
                    <SentimentBadge sentiment={c.sentiment} />
                    <Badge color="#6366f1">{c.product || "Global"}</Badge>
                    <Badge color="#a855f7">{c.category || "General"}</Badge>
                    {c.regulatoryFlag && (
                      <div style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        backgroundColor: "#dc262620",
                        color: "#dc2626",
                        border: "1px solid #dc262640"
                      }}>
                        REGULATORY
                      </div>
                    )}
                 </div>
                 <span style={{ fontSize: "0.95rem", color: "var(--text-muted)", fontWeight: "600" }}>
                   {new Date(c.createdAt).toLocaleString()}
                 </span>
              </div>

              <div style={{ marginBottom: "32px" }}>
                <p style={{
                  fontSize: "1.4rem",
                  fontWeight: "700",
                  margin: "0 0 12px 0",
                  lineHeight: "1.6",
                  color: "var(--text-primary)"
                }}>
                  {c.text}
                </p>
                <div style={{ color: "var(--text-muted)", fontSize: "0.95rem", fontWeight: "600", display: "flex", gap: "12px" }}>
                   <span style={{ color: "#f59e0b", fontWeight: "700" }}>Root Cause:</span> {c.rootCause || "AI analyzing..."}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div style={{
                  background: "linear-gradient(135deg, #6366f110, #6366f105)",
                  padding: "24px",
                  borderRadius: "18px",
                  border: "1px solid #6366f130",
                  borderLeft: "4px solid #6366f1"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ 
                      width: "12px", 
                      height: "12px", 
                      borderRadius: "50%", 
                      background: "#6366f1",
                      boxShadow: "0 0 8px #6366f1"
                    }}></span>
                    <p style={{ margin: 0, color: "#6366f1", fontWeight: "900", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.08em" }}>Gen-AI Response</p>
                  </div>
                  <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "1.05rem" }}>
                    {typeof c.aiResponse === 'object' ? c.aiResponse.response : c.aiResponse || "AI generating response..."}
                  </p>
                </div>

                <div style={{
                  background: "linear-gradient(135deg, #a855f710, #a855f705)",
                  padding: "24px",
                  borderRadius: "18px",
                  border: "1px solid #a855f730",
                  borderLeft: "4px solid #a855f7"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ 
                      width: "12px", 
                      height: "12px", 
                      borderRadius: "50%", 
                      background: "#a855f7",
                      boxShadow: "0 0 8px #a855f7"
                    }}></span>
                    <p style={{ margin: 0, color: "#a855f7", fontWeight: "900", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.08em" }}>Next Action</p>
                  </div>
                  <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "1.05rem", fontWeight: "700" }}>
                    {typeof c.aiResponse === 'object' ? c.aiResponse.nextAction : c.nextBestAction || "AI analyzing..."}
                  </p>
                </div>
              </div>

              {c.similar && c.similar.length > 0 && (
                <div style={{
                  marginTop: "24px",
                  padding: "16px",
                  background: "linear-gradient(135deg, #f59e0b10, #f59e0b05)",
                  borderRadius: "12px",
                  border: "1px solid #f59e0b30"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", fontWeight: "700", color: "#f59e0b" }}>
                    {c.similar.length} Similar Complaint(s) Found
                  </p>
                  {c.similar.slice(0, 2).map((similar, idx) => (
                    <div key={idx} style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                      • {similar.text.substring(0, 100)}... (Score: {Math.round(similar.score * 100)}%)
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ 
                      width: "12px", 
                      height: "12px", 
                      borderRadius: "50%", 
                      backgroundColor: c.status === "Resolved" ? "#10b981" : "#f59e0b",
                      boxShadow: `0 0 10px ${c.status === "Resolved" ? "#10b981" : "#f59e0b"}`
                    }}></span>
                    <span style={{
                        fontSize: "1rem",
                        fontWeight: "900",
                        color: c.status === "Resolved" ? "#10b981" : "#f59e0b"
                    }}>
                      {c.status.toUpperCase()}
                    </span>
                 </div>
                 <button 
                   onClick={() => {
                     setSelectedComplaint(c);
                     setShowModal(true);
                   }}
                   style={{
                   background: "linear-gradient(135deg, #6366f1, #818cf8)",
                   color: "white",
                   border: "none",
                   padding: "12px 24px",
                   borderRadius: "12px",
                   fontSize: "0.95rem",
                   fontWeight: "800",
                   cursor: "pointer",
                   transition: "all 0.3s ease",
                   boxShadow: "0 4px 20px rgba(99, 102, 241, 0.3)"
                 }}>
                   ANALYZE DEEP &rarr;
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 360° Deep Analysis Modal */}
      {showModal && selectedComplaint && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(5px)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px"
        }} onClick={() => setShowModal(false)}>
          <div 
            className="glass-card"
            style={{
              maxWidth: "900px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              padding: "40px",
              animation: "fadeInUp 0.3s ease-out"
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "900" }}>360° Deep Analysis</h2>
              <button 
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "var(--text-muted)"
                }}
              >
                ×
              </button>
            </div>

            {/* Complaint Details */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                <PriorityBadge priority={selectedComplaint.priority} />
                <SentimentBadge sentiment={selectedComplaint.sentiment} />
                <Badge color="#6366f1">{selectedComplaint.category || "General"}</Badge>
                {selectedComplaint.regulatoryFlag && (
                  <div style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    backgroundColor: "#dc262620",
                    color: "#dc2626",
                    border: "1px solid #dc262640"
                  }}>
                    REGULATORY
                  </div>
                )}
              </div>
              
              <p style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                margin: "0 0 16px 0",
                lineHeight: "1.6",
                color: "var(--text-primary)"
              }}>
                {selectedComplaint.text}
              </p>
              
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Submitted: {new Date(selectedComplaint.createdAt).toLocaleString()}
              </div>
            </div>

            {/* AI Analysis Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              <div style={{
                background: "linear-gradient(135deg, #6366f110, #6366f105)",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #6366f130"
              }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#6366f1", fontSize: "0.9rem" }}>Category</h4>
                <p style={{ margin: 0, fontWeight: "700" }}>{selectedComplaint.category || "General"}</p>
              </div>
              
              <div style={{
                background: "linear-gradient(135deg, #a855f710, #a855f705)",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #a855f730"
              }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#a855f7", fontSize: "0.9rem" }}>Severity</h4>
                <p style={{ margin: 0, fontWeight: "700" }}>{selectedComplaint.severity || "Medium"}</p>
              </div>
              
              <div style={{
                background: "linear-gradient(135deg, #f59e0b10, #f59e0b05)",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #f59e0b30"
              }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#f59e0b", fontSize: "0.9rem" }}>Root Cause</h4>
                <p style={{ margin: 0, fontWeight: "600" }}>{selectedComplaint.rootCause || "AI analyzing..."}</p>
              </div>
              
              <div style={{
                background: "linear-gradient(135deg, #10b98110, #10b98105)",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #10b98130"
              }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#10b981", fontSize: "0.9rem" }}>Next Action</h4>
                <p style={{ margin: 0, fontWeight: "600" }}>
                  {typeof selectedComplaint.aiResponse === 'object' 
                    ? selectedComplaint.aiResponse.nextAction 
                    : selectedComplaint.nextBestAction || "Review complaint"}
                </p>
              </div>
            </div>

            {/* AI Response */}
            {selectedComplaint.aiResponse && (
              <div style={{
                background: "linear-gradient(135deg, #6366f110, #6366f105)",
                padding: "20px",
                borderRadius: "12px",
                borderLeft: "4px solid #6366f1",
                marginBottom: "24px"
              }}>
                <h4 style={{ margin: "0 0 12px 0", color: "#6366f1", fontSize: "0.9rem" }}>AI Suggested Response</h4>
                <p style={{ margin: 0, lineHeight: "1.6" }}>
                  {typeof selectedComplaint.aiResponse === 'object' 
                    ? selectedComplaint.aiResponse.response 
                    : selectedComplaint.aiResponse}
                </p>
              </div>
            )}

            {/* Similar Complaints */}
            {selectedComplaint.similar && selectedComplaint.similar.length > 0 && (
              <div style={{
                background: "linear-gradient(135deg, #f59e0b10, #f59e0b05)",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #f59e0b30",
                marginBottom: "24px"
              }}>
                <h4 style={{ margin: "0 0 12px 0", color: "#f59e0b", fontSize: "0.9rem" }}>
                  {selectedComplaint.similar.length} Similar Complaint(s) Detected
                </h4>
                {selectedComplaint.similar.map((similar, idx) => (
                  <div key={idx} style={{ 
                    fontSize: "0.85rem", 
                    color: "var(--text-secondary)", 
                    marginBottom: "8px",
                    padding: "8px",
                    background: "rgba(255,255,255,0.5)",
                    borderRadius: "8px"
                  }}>
                    <strong>Match: {Math.round(similar.score * 100)}%</strong> - {similar.text.substring(0, 120)}...
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "12px 24px",
                  background: "transparent",
                  border: "2px solid var(--border)",
                  borderRadius: "12px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert("Status update feature coming soon!");
                  setShowModal(false);
                }}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "800",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
                }}
              >
                Resolve Issue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}