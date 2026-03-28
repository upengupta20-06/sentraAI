import React, { useEffect, useState } from "react";
import { getComplaints } from "../services/api";

export default function Dashboard({ refresh }) {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await getComplaints();
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  return (
    <div style={{ margin: "20px" }}>
      <h2>Dashboard</h2>

      {data.length === 0 ? (
        <p>No complaints yet</p>
      ) : (
        data.map((c, i) => (
          <div
            key={i}
            style={{
              border: "1px solid black",
              padding: "10px",
              marginBottom: "10px"
            }}
          >
            <p><b>Complaint:</b> {c.text}</p>
            <p><b>Sentiment:</b> {c.sentiment}</p>
            <p><b>Category:</b> {c.category}</p>
            <p><b>Priority:</b> {c.priority}</p>
            <p><b>Status:</b> {c.status}</p>
            <p><b>AI Response:</b> {c.aiResponse}</p>
          </div>
        ))
      )}
    </div>
  );
}