import logo from './logo.svg';
import './App.css';
import Chatbot from './Chatbot/Chatbot';

function App() {
  return (
    <div className="App" style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>🩺 Health Symptom Checker</h1>
      <Chatbot />
    </div>
  );
}

export default App;
