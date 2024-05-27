import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chatbot from "./components/Chatbot";
import Bot from "./components/Bot";
import Chatkit from "./components/Chatkit";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Bot />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/kit" element={<Chatkit />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
