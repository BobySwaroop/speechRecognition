import React from "react";
import Chatbot from "react-chatbot-kit";
import Config from "./chatbot/Config";
import MessageParser from "./chatbot/MessageParser";
import ActionProvider from "./chatbot/ActionProvider";

const Chatkit = () => {
  return (
    <div>
      <Chatbot
        config={Config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  )
}

export default Chatkit
