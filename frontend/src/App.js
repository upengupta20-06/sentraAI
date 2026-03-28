import React, { useState } from "react";
import ComplaintForm from "./components/ComplaintForm";
import Dashboard from "./components/Dashboard";

function App() {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>SentraAI</h1>

      <ComplaintForm refresh={triggerRefresh} />
      <Dashboard refresh={refresh} />
    </div>
  );
}

export default App;