import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from "../../../firebase/firebase";
import './X.css'

function ForgotPassword() {
 const handleSubmit = async(e) => {
    e.preventDefault();
    const email = e.target.email.value;
    sendPasswordResetEmail(auth, email).then(data=>{
        alert("Check your email for reset link");
    }).catch(err=>{
        alert(err.code);
    }) }
  return (
  <div className="forgot-password-wrapper">
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Enter your email" />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  </div>
);
}
export default ForgotPassword;
