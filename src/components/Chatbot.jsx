import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Chatbot = () => {
  const [userQuery, setUserQuery] = useState('');
  const [botResponse, setBotResponse] = useState('');
  const [transcribing, setTranscribing] = useState(true);
  const [clearTranscriptOnListen, setClearTranscriptOnListen] = useState(true);
  
  const toggleTranscribing = () => setTranscribing(!transcribing);
  const toggleClearTranscriptOnListen = () => setClearTranscriptOnListen(!clearTranscriptOnListen);

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
      callback: () => setBotResponse('Currently I am working as a software developer')
    },
  ];

  const {
    transcript,
    resetTranscript,
    listening,
    interimTranscript,
    finalTranscript,
  } = useSpeechRecognition({ commands, transcribing, clearTranscriptOnListen });

  useEffect(() => {
    if (listening && transcript) {
      setUserQuery(transcript);
      handleUserQuery(transcript);
    }
  }, [transcript, listening]);

  useEffect(() => {
    if (interimTranscript !== '') {
      console.log('Got interim result:', interimTranscript)
    }
    if (finalTranscript !== '') {
      console.log('Got final result:', finalTranscript)
    }
  }, [interimTranscript, finalTranscript]);

  useEffect(() => {
    if (botResponse) {
      speakMessage(botResponse);
    }
  }, [botResponse]);

  const handleUserQuery = (query) => {
    const command = commands.find(cmd => {
      if (typeof cmd.command === 'string') {
        return query.toLowerCase().includes(cmd.command.toLowerCase());
      } else if (Array.isArray(cmd.command)) {
        return cmd.command.some(cmdItem => query.toLowerCase().includes(cmdItem.toLowerCase()));
      }
      return false;
    });
  
    if (command) {
      command.callback();
    } else {
      setBotResponse("I'm sorry, I didn't understand that.");
    }
  };
  
  const speakMessage = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-IN';
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

      <div style={{ overflow: 'hidden' }}>
        <div style={{ float: 'left', textAlign: 'left', width: '50%' }}>
          <p>User: {userQuery}</p>
        </div>
        <div style={{ float: 'left', textAlign: 'left', width: '50%' }}>
          <p>Bot: {botResponse}</p> 
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
