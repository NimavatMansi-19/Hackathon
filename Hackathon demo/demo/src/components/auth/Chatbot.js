import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Add this
import './Chatbot.css';

export default function Chatbot() {
  const [userInput, setUserInput] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // <-- Add this

  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await res.json();
      setReply(data.reply);
    } catch (err) {
      setReply('Error: Failed to fetch response.');
    }
    setLoading(false);
  };

  return (
    <div className="chatbot-container">
      <h2 className="chatbot-title">🩺 Symptom Checker Chatbot</h2>

      <textarea
        className="chatbot-textarea"
        rows={5}
        placeholder="Describe your symptoms..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />

      <button
        className="chatbot-button"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Checking...' : 'Send'}
      </button>

      <button
        className="chatbot-button"
        onClick={() => navigate('/hospitals')}
        style={{ marginTop: '10px' }}
      >
        Nearby Hospitals
      </button>

      {reply && (
        <div className="chatbot-reply">
          <strong>AI Response:</strong>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
}
