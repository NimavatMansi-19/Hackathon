import React, { useEffect, useState } from "react";
import "./login.css";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../../../firebase/auth"; 
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loginToggle = document.getElementById("loginToggle");
    const registerToggle = document.getElementById("registerToggle");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const showRegister = document.getElementById("showRegister");
    const showLogin = document.getElementById("showLogin");

    const switchToLogin = () => {
      loginToggle?.classList.add("active");
      registerToggle?.classList.remove("active");
      loginForm?.classList.add("active");
      registerForm?.classList.remove("active");
    };

    const switchToRegister = () => {
      registerToggle?.classList.add("active");
      loginToggle?.classList.remove("active");
      registerForm?.classList.add("active");
      loginForm?.classList.remove("active");
    };

    loginToggle?.addEventListener("click", switchToLogin);
    registerToggle?.addEventListener("click", switchToRegister);
    showRegister?.addEventListener("click", (e) => {
      e.preventDefault();
      switchToRegister();
    });
    showLogin?.addEventListener("click", (e) => {
      e.preventDefault();
      switchToLogin();
    });

    return () => {
      loginToggle?.removeEventListener("click", switchToLogin);
      registerToggle?.removeEventListener("click", switchToRegister);
      showRegister?.removeEventListener("click", switchToRegister);
      showLogin?.removeEventListener("click", switchToLogin);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSigningIn(true);
    try {
      await doSignInWithEmailAndPassword(email, password);
      navigate("/chatbot"); // Change as per your route
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await doSignInWithGoogle();
      navigate("/chatbot"); // Change as needed
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="logo-section">
      <img src="/assets/img/logo.png" alt="MediCare AI Logo" className="logo-img" />
      <h2 className="logo-text">MediCare AI</h2>
    </div>
      <div className="login-form active" id="loginForm">
        <form id="loginFormElement" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email or Username</label>
            <div className="input-container">
              <input
                className="form-input"
                type="text"
                id="loginIdentifier"
                placeholder="Enter email or username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4Z M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-container">
              <input
                className="form-input"
                type="password"
                id="loginPassword"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18Z" />
              </svg>
            </div>
          </div>

          <div className="form-options">
            <div className="remember-me">
              <div className="custom-checkbox">
                <input type="checkbox" id="remember" />
                <div className="checkmark"></div>
              </div>
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <button type="submit" className="auth-btn" id="loginBtn" disabled={isSigningIn}>
            {isSigningIn ? "Signing in..." : "Sign In to MediCare AI"}
          </button>
        </form>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <button className="google-btn" id="googleLoginBtn" onClick={handleGoogleSignIn}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="auth-footer">
          New to MediCare AI? <a href="#" id="showRegister">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
