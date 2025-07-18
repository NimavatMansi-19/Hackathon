# 🧠 Smart Symptom Checker & Health Recommender

An AI-powered health chatbot web application that assists users in understanding symptoms and provides basic health recommendations. It interacts via a conversational interface and supports multiple languages, offline access, and nearby clinic suggestions.

> ⚠️ *Disclaimer: This application is not a replacement for professional medical advice. Always consult a qualified physician for medical concerns.*

---

## 🔰 Overview

This application helps users:
- Input symptoms through a chatbot interface
- Get basic advice and urgency level
- View nearby clinics
- Use offline and multi-language support
- Maintain privacy and secure user data

---

## ✅ Key Features

### 👤 User Accounts & Profiles
- OTP-based registration/login
- Profile setup: Name, age, gender, language, medical history (optional)
- Edit/delete profile
- View last 10 chatbot interactions

### 💬 Chatbot Interaction (Core)
- Friendly conversational UI
- Asks for common symptoms (e.g., fever, cough, headache)
- Rule-based or AI/ML-based symptom analysis
- Urgency classification:
  - 🟢 Self-care
  - 🟡 Visit clinic soon
  - 🔴 Seek immediate care

### 🌐 Multi-language Support
- Support for English, Hindi, Gujarati
- JSON/i18n-based translations

### 🏥 Nearby Clinics Integration
- Location-based clinic listings (mock/static data or API)
- Clinic details with call and Google Maps link

### 🔃 Offline Support & Data Sync
- Store last 5–10 chat sessions locally
- Offline symptom guidance
- Auto-sync when internet reconnects

### 🛡 Privacy & Security
- Encrypted local/backend data storage
- User-controlled profile/history deletion
- No third-party sharing of health data

### 🧰 Admin Dashboard
- View chatbot usage stats
- Manage clinic records (add/edit/delete)
- Export anonymized user reports

### 📱 UX & Platform Support
- Mobile-first responsive web app (React.js or Flutter Web)
- Clean, chat-style UI with light/dark mode
- Smooth animations for better UX

---

## 📈 Optional Enhancements
- 📴 PWA: Installable with offline caching
- 🎤 Voice input via Web Speech API
- 🤖 Lightweight AI/ML for symptom classification
- 🧭 Adaptive follow-up questions
- 📞 Telemedicine service integration

---

## 🛠 Tech Stack (Suggested)
- **Frontend**: React.js / Flutter Web
- **Backend**: Node.js / Express / Firebase / Django (optional)
- **ML Integration**: TensorFlow.js / Custom JSON logic
- **Database**: Firestore / SQLite / LocalStorage for offline
- **APIs**: Google Maps, Speech-to-Text

---

## 🚀 Getting Started

### Prerequisites
- Node.js or Flutter SDK
- Git

### Installation
```bash
git clone https://github.com/yourusername/symptom-checker.git
cd symptom-checker
npm install
npm start
