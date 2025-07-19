import React, { useEffect, useState } from "react";
import "./login.css";
import { doSignInWithEmailAndPassword, doSignInWithGoogle, doCreateUserWithEmailAndPassword, doSendEmailVerification } from "../../../firebase/auth"; 
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

  const handleSendVerification = async () =>{
      try {
    await doCreateUserWithEmailAndPassword(email, password);

    
    await doSendEmailVerification();

   
    alert("Verification email sent! Please check your inbox.");

    navigate("/chatbot"); // or redirect only after verification if needed
  } catch (err) {
    setErrorMessage(err.message);
  } finally {
    setIsSigningIn(false);
  }
  }

  return (
  <div className="auth-container">
     <div className="logo-section">
            <div className="logo">
                <div className="logo-icon">🩺</div>
            </div>
      <h2 className="logo-text">MediCare AI</h2>
    </div>

    {/* LOGIN FORM */}
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

      <div className="divider"><span>or continue with</span></div>

      <button className="google-btn" id="googleLoginBtn" onClick={handleGoogleSignIn}>
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25..."/>
          <path fill="#34A853" d="M12 23..."/>
          <path fill="#FBBC05" d="M5.84 14.09..."/>
          <path fill="#EA4335" d="M12 5.38..."/>
        </svg>
        Continue with Google
      </button>

      <div className="auth-footer">
        New to MediCare AI? <a href="#" id="showRegister">Create an account</a>
      </div>
    </div>

    {/* REGISTER FORM */}
    <div className="register-form" id="registerForm">
      <form id="registerFormElement" onSubmit={handleSendVerification}>

        <div className="form-group">
          <label className="form-label">Email</label>
          <div className="input-container">
            <input
              className="form-input"
              type="email"
              placeholder="Enter email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4Z" />
            </svg>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="input-container">
            <input
              className="form-input"
              type="password"
              placeholder="Create password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,17A2,2 0 0,0 14,15..." />
            </svg>
          </div>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button type="submit" className="auth-btn" disabled={isSigningIn}>
          {isSigningIn ? "Registering..." : "Create Account"}
        </button>

        <div className="divider"><span>or sign up with</span></div>

        <button className="google-btn" onClick={handleGoogleSignIn}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25..."/>
            <path fill="#34A853" d="M12 23..."/>
            <path fill="#FBBC05" d="M5.84 14.09..."/>
            <path fill="#EA4335" d="M12 5.38..."/>
          </svg>
          Sign up with Google
        </button>

        <div className="auth-footer">
          Already have an account? <a href="#" id="showLogin">Sign In</a>
        </div>
      </form>
    </div>
  </div>
);

};

export default Login;
