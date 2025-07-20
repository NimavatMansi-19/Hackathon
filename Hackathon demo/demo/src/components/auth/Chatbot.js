import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Add this
import axios from "axios";
import "./Chatbot.css";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("English");
  const [darkMode, setDarkMode] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const navigate = useNavigate(); // ✅ Initialize the hook

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");

    try {
      setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);

      const res = await axios.post("http://localhost:5000/api/ask", {
        message: userMessage,
        language,
      });

      const botReply = res.data.reply;

      setChatHistory((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch (error) {
      const errorMsg = "Error: " + error.message;
      setChatHistory((prev) => [...prev, { role: "bot", content: errorMsg }]);
    }
  };

  const goToHospitals = () => {
    navigate("/hospitals"); // ✅ Route to Location component
  };

  return (
    <div className={`chatbot-container ${darkMode ? "dark" : "light"}`}>
      <div className="toggle-theme">
        <label className="switch">
          <input type="checkbox" onChange={() => setDarkMode(!darkMode)} />
          <span className="slider round"></span>
        </label>
        <span>{darkMode ? "Dark" : "Light"} Mode</span>
      </div>

      <h2 className="title">💬 Medicare AI Chatbot</h2>

      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.role === "user" ? "user" : "bot"}`}
          >
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <textarea
        className="input-box"
        placeholder="Enter your symptoms..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <select
        className="language-dropdown"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="English">English</option>
        <option value="Hindi">Hindi</option>
      </select>
      
           <button
      className="signout-button"
      onClick={() => {
        localStorage.clear();
        navigate('/');
      }}
    >
      Sign Out
    </button>

      <button className="send-button" onClick={sendMessage}>
        Send
      </button>

      {/* ✅ New Button for Nearby Hospitals */}
      <button className="send-button" style={{ backgroundColor: "#2196f3" }} onClick={goToHospitals}>
        🏥 Nearby Hospitals
      </button>
    </div>
  );
};

export default Chatbot;
