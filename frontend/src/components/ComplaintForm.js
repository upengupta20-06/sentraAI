import React, { useState } from "react";
import { sendComplaint } from "../services/api";

export default function ComplaintForm({ refresh }) {
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;

    await sendComplaint(text);
    setText("");
    refresh();
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Submit Complaint</h2>

      <textarea
        rows="4"
        cols="50"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter complaint..."
      />

      <br />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}