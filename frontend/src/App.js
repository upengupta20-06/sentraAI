import React, { useState } from "react";
import ComplaintForm from "./components/ComplaintForm";
import Dashboard from "./components/Dashboard";

function App() {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <div style={{ padding: "40px" }}>
      <header style={{
        textAlign: "center",
        marginBottom: "64px"
      }}>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "800",
          margin: "0 0 16px 0",
          backgroundImage: "linear-gradient(to right, #6366f1, #a855f7)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          SentraAI
        </h1>
        <p style={{
          fontSize: "1.1rem",
          color: "#64748b",
          maxWidth: "500px",
          margin: "0 auto"
        }}>
          The modern platform for intelligent complaint management powered by AI.
        </p>
      </header>

      <main>
        <ComplaintForm refresh={triggerRefresh} />
        <Dashboard refresh={refresh} />
      </main>
    </div>
  );
}

export default App;