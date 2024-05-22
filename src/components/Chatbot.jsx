import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Chatbot = () => {
  const [userQuery, setUserQuery] = useState('');
  const [botResponse, setBotResponse] = useState('');
  
  const commands = [
    {
      command: 'reset',
      callback: () => resetTranscript()
    },
    {
      command: ['shut-up', 'exit', 'stop'],
      callback: () => setBotResponse("I wasn't talking."),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2

    },
    {
        command: ['eat', 'sleep', 'leave'],
        callback: (command) => setBotResponse(`Best matching command: ${command}`),
        isFuzzyMatch: true,
        fuzzyMatchingThreshold: 0.2,
        bestMatchOnly: true
      },
    {
      command: 'Hello',
      callback: () => setBotResponse('Hi! My name is Chatbuddy. How can I assist you?')
    },
    {
      command: 'what is react js',
      callback: () => setBotResponse('React is a free and open-source front-end JavaScript library for building user interfaces based on components.')
    },
    {
      command: 'what is python',
      callback: () => setBotResponse('Python is a high-level, general-purpose programming language. Python is dynamically typed and garbage-collected.')
    },
    {
      command: 'what are you doing',
      callback: () => setBotResponse('Currently i am working as a software developer')
    },
    // Add more commands as needed
  ];

  const {
    transcript,
    resetTranscript,
    listening,
  } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (transcript) {
      setUserQuery(transcript);
      handleUserQuery(transcript);
    }
  }, [transcript]);

  const handleUserQuery = (query) => {
    const command = commands.find(cmd =>
      query.toLowerCase().includes(cmd.command.toLowerCase()) ||
      cmd.command.toLowerCase().includes(query.toLowerCase())
    );
    if (command) {
      command.callback();
    } else {
      setBotResponse("I'm sorry, I didn't understand that.");
    }
  };
  
// fdffd

  useEffect(() => {
    if (botResponse) {
      speakMessage(botResponse);
    }
  }, [botResponse]);

  const speakMessage = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
  };

  const listenContinuously = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-IN',
    });
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>Your browser does not support speech recognition software. Please try using a different browser.</div>;
  }

  return (
    <div>
      <div>
        <span>Listening: {listening ? 'on' : 'off'}</span>
        <div>
          <button type="button" onClick={resetTranscript}>Reset</button>
          <button type="button" onClick={listenContinuously}>Listen</button>
          <button type="button" onClick={SpeechRecognition.stopListening}>Stop</button>
        </div>
      </div>

      <div>
        <div style={{ float: 'left', marginRight: '10px' }}>
          <p>Bot: {botResponse}</p> 
        </div>
        <div style={{ clear: 'both' }}>
          <p>User: {userQuery}</p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;