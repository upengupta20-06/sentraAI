import React, { useState, useEffect } from "react";
import ComplaintForm from "./components/ComplaintForm";
import Dashboard from "./components/Dashboard";
import logo from "./logo.svg";

function App() {
  const [refresh, setRefresh] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [complaints, setComplaints] = useState([]);

  const triggerRefresh = () => {
    setRefresh(!refresh);
  };

  const handleNewComplaint = (complaint) => {
    setComplaints(prev => [complaint, ...prev]);
  };

  useEffect(() => {
    // Apply light theme styles
    document.documentElement.style.setProperty('--bg-primary', '#ffffff');
    document.documentElement.style.setProperty('--bg-secondary', '#f8fafc');
    document.documentElement.style.setProperty('--bg-tertiary', '#f1f5f9');
    document.documentElement.style.setProperty('--text-primary', '#1e293b');
    document.documentElement.style.setProperty('--text-secondary', '#475569');
    document.documentElement.style.setProperty('--text-muted', '#64748b');
    document.documentElement.style.setProperty('--accent', '#3b82f6');
    document.documentElement.style.setProperty('--accent-hover', '#2563eb');
    document.documentElement.style.setProperty('--success', '#10b981');
    document.documentElement.style.setProperty('--warning', '#f59e0b');
    document.documentElement.style.setProperty('--danger', '#ef4444');
    document.documentElement.style.setProperty('--border', '#e2e8f0');
  }, [darkMode]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
      color: 'var(--text-primary)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Clean Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 40% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, padding: "40px" }}>
        {/* Header */}
        <header style={{
          textAlign: "center",
          marginBottom: "64px",
          animation: "fadeInDown 0.8s ease-out"
        }}>
          {/* Logo */}
          <div style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 24px auto",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
            animation: "float 3s ease-in-out infinite"
          }}>
            <span style={{ 
              fontSize: "36px", 
              fontWeight: "900", 
              color: "white",
              letterSpacing: "-2px"
            }}>
              S
            </span>
          </div>
          
          <h1 style={{
            fontSize: "3.5rem",
            fontWeight: "900",
            margin: "0 0 16px 0",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.05em"
          }}>
            SentraAI
          </h1>
          <p style={{
            fontSize: "1.3rem",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto 32px auto",
            lineHeight: "1.6",
            opacity: 0.9
          }}>
            AI-Powered Customer Complaint Intelligence Platform
          </p>
          
          {/* Feature Pills */}
          <div style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            marginTop: "24px"
          }}>
            {[
              { label: "Real-time AI", color: "#3b82f6" },
              { label: "Smart Analytics", color: "#10b981" },
              { label: "Auto-Categorize", color: "#f59e0b" },
              { label: "Gen-AI Replies", color: "#8b5cf6" }
            ].map((pill, i) => (
              <div key={i} style={{
                background: `linear-gradient(135deg, ${pill.color}10, ${pill.color}05)`,
                border: `1px solid ${pill.color}30`,
                borderRadius: "20px",
                padding: "8px 16px",
                fontSize: "0.9rem",
                fontWeight: "600",
                backdropFilter: "blur(10px)",
                animation: `fadeInUp 0.8s ease-out ${i * 0.1}s both`
              }}>
                {pill.label}
              </div>
            ))}
          </div>
        </header>

        <main>
          <ComplaintForm refresh={triggerRefresh} onNewComplaint={handleNewComplaint} />
          <Dashboard refresh={refresh} complaints={complaints} setComplaints={setComplaints} />
        </main>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export default App;