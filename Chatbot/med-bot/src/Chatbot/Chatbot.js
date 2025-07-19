import React, { useState } from 'react';

export default function Chatbot() {
  const [userInput, setUserInput] = useState('');
  const [reply, setReply] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:5000/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput }),
    });
    const data = await res.json();
    setReply(data.reply);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Symptom Checker Chatbot</h2>
      <textarea value={userInput} onChange={e => setUserInput(e.target.value)} />
      <button onClick={handleSubmit}>Send</button>
      <div className="mt-4 bg-gray-100 p-2 rounded">{reply}</div>
    </div>
  );
}
