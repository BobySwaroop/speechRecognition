import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chatbot from "./components/Chatbot";
import Bot from "./components/Bot";
import Chatkit from "./components/Chatkit";
import Avatar from "./components/chatbot/Avatar";
import Ai from "./components/chatbot/Ai";
import ModelRender from "./components/Avtar/ModelRender";
import MessageParser from "./components/chatbot/MessageParser";
import Config from "./components/chatbot/Config";


function App() {  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Bot />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/kit" element={<Chatkit />} />
          <Route path="/avtar" element={<Avatar />} />
          <Route path="/ai" element={<Ai />} />
          <Route path="/model" element={<ModelRender />} />
          <Route path="/m" element={<MessageParser />} />
          <Route path="/cc" element={<Config />} />


        </Routes>
      </Router>
    </div>
  );
}

export default App;
