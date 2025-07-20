import React from "react";
import Login from "./components/auth/login/";
import Dashboard from "./components/auth/login/dashboard";
import {Routes,Route } from "react-router-dom";
import "./index.css";
import Chatbot from "./components/auth/Chatbot";
import Location from "./components/auth/Location";
import ForgotPassword from "./components/auth/login/ForgotPassword";

const App = () => {
  return (
    <>
      {/* Background Animation Layer */}
      <div className="bg-animation">
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
        <div className="floating-shape shape4"></div>
        <div className="medical-icon medical1">🏥</div>
        <div className="medical-icon medical2">⚕</div>
        <div className="medical-icon medical3">🔬</div>
      </div>

      {/* Login/Register Auth Component */}
       
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chatbot" element={<Chatbot />} /> 
        <Route path="/hospitals" element={<Location/>}/>
       

<Route path="/forgot-password" element={<ForgotPassword />} />


      </Routes>

    </>
  );
};

export default App;
