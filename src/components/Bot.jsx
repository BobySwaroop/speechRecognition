import React, { useEffect, useState, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import mic from "../assets/7123011_google_mic_icon.svg";
import 'tailwindcss/tailwind.css';

const Bot = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([{ sender: 'bot', text: "Hello! How can I assist you today?" }]);
  const messagesEndRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const commands = [
    {
      command: 'reset',
      callback: () => resetTranscript()
    },
  
    {
      command: ['shut up', 'exit', 'stop', 'chup karo', 'band karo'],
      callback: () => addBotMessage("I don't talk with you"),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2
    },
    {
      command: "change colour to *",
      callback: (color) => {
        document.body.style.background = color;
      },
    },
    {
      command: "reset  colour",
      callback: () => {
        document.body.style.background = `rgba(0, 0, 0, 0.8)`;
      },
    },
    {
      command: ['hello', 'hi', 'how are you', 'hey', 'hello bot', 'hii bot'],
      callback: () => addBotMessage('Hi! How can I assist you?'),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.8,
    },
    {
      command: ["what's your name", "apna naam batao", "naam kya hain tumhara"],
      callback: () => addBotMessage('Hi! i am chatbuddy, how can i help you ?') ,
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.5,
    },
    {
      command: ["how are you", 'kaise ho'],
      callback: () => addBotMessage('I am good what about you ?') ,
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.5,
    },
    {
      command: 'what is react js',
      callback: () => addBotMessage('React is a free and open-source front-end JavaScript library for building user interfaces based on components.'),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.5,
      bestMatchOnly: true
    },
    {
      command: 'what is python',
      callback: () => addBotMessage('Python is a high-level, general-purpose programming language. Python is dynamically typed and garbage-collected.'),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.5,
      bestMatchOnly: true
    },
    {
      command: ['machine learning', 'ml', 'what is ml'],
      callback: () => addBotMessage('Machine learning (ML) is a branch of AI and computer science that focuses on the using data and algorithms to enable AI to imitate the way that humans'),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.7,
    },
    {
      command: 'what is deep learning',
      callback: () => addBotMessage('Deep learning is the subset of machine learning methods based on neural networks with representation learning'),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.8,
    },
    {
      command: ['what is Artifical intelligence', 'ai'],
      callback: () => addBotMessage('Artificial intelligence, or AI, is technology that enables computers and machines to simulate human intelligence and problem-solving capabilities.'),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.5,
    },
    {
      command: 'nlp',
      callback: () => addBotMessage('Natural language processing (NLP) is a branch of artificial intelligence (AI) that enables computers to comprehend, generate, and manipulate human language.'),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.5,
    },
    {
      command: 'what about alexa',
      callback: () => addBotMessage('Amazon Alexa or Alexa is a virtual assistant technology largely based on a Polish speech synthesizer named Ivona, bought by Amazon in 2013.'),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.5,
    },
    {
      command: 'google',
      callback: () => addBotMessage('Oh Hii, nice to talk , you how can help you?'),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.5,
    },
    {
      command: ['what are you doing', 'kya kar rahe ho'],
      callback: () => addBotMessage('Currently I am working as a software developer.')
    },
    {
      command: 'open *',
      callback: (websiteUrl) => {
        const trim = websiteUrl.replace(/\s/g, '');
        const urlToOpen = `https://${trim}.com`;
        const newTab = window.open(urlToOpen, '_blank');
        if (newTab) {
          newTab.focus();
          addBotMessage(`Opening ${urlToOpen}`);
        } else {
          addBotMessage('Popup blocker is preventing the website from opening. Please allow popups for this site.');
        }
      },
      isFuzzyMatch: false // Disable fuzzy matching for this command
    },
    {
      command: ['go back', 'back'],
      callback: () => {
        window.history.back();
        addBotMessage('Navigating back');
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.5,
    },
    {
      command: ['go forward', 'forward'],
      callback: () => {
        window.history.forward();
        addBotMessage('Navigating forward');
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.5,
    },
 
    // Add more commands as needed
  ];

  const { resetTranscript, listening, transcript, finalTranscript } = useSpeechRecognition({ commands, interimResults: true, continuous: false });

  useEffect(() => {
    if (listening && finalTranscript) {
      setUserInput(transcript);
      resetTranscript();
      setSubmitting(true); // Set submitting state to true when user stops speaking
      setTimeout(() => {
        console.log('hh')
        handleSubmit(); // Automatically submit the form after 1 seconds of user stopping speech
      }, 1000);
    }
  }, [listening, finalTranscript, resetTranscript]);

  const handleQuery = (query) => {
    const command = commands.find(cmd => {
      if (typeof cmd.command === 'string') {
        return query.toLowerCase().includes(cmd.command.toLowerCase());
      } else if (Array.isArray(cmd.command)) {
        return cmd.command.some(cmdItem => query.toLowerCase().includes(cmdItem.toLowerCase()));
      }
      return false;
    });
    if (command) {
      command.callback(query);
    } else {
      addBotMessage("Sorry, I don't understand that.");
    }
  };

  const addBotMessage = (message) => {
    setMessages(prev => [...prev, { sender: 'bot', text: message }]);
    speakMessage(message);
  };

  const addUserMessage = (message) => {
    setMessages(prev => [...prev, { sender: 'user', text: message }]);
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

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (userInput.trim() !== '') {
      addUserMessage(userInput);
      handleQuery(userInput);
      setUserInput('');
      resetTranscript(); // Clear the transcript after handling the query
    }
  };

  const handleVoiceInput = (transcript) => {
    addUserMessage(transcript);
  };

  useEffect(() => {
    if (!listening && transcript) {
      handleVoiceInput(transcript);
      resetTranscript();
    }
  }, [transcript, listening, resetTranscript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>Your browser does not support speech recognition software. Please try using a different browser.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <div className="mb-4">
        <span className="font-bold">Listening:</span> {listening ? 'on' : 'off'}
        <div className="flex">
          <button className="p-2 mr-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700" type="button" onClick={resetTranscript}>Reset</button>
          <button type="button" onClick={listenContinuously}><img className="w-10 h-12" src={mic} alt="microphone" /></button>
          <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700" type="button" onClick={SpeechRecognition.stopListening}>Stop</button>
        </div>
      </div>

      <div className="w-1/2 overflow-y-auto bg-white border-2 rounded shadow-lg border-slate-400 h-96" style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1' }}>
        <div className="h-full p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1' }}>
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'} mb-2`}>
              {message.sender === 'bot' && (
                <div className="flex items-center">
                  <img src='https://cdn-icons-png.freepik.com/512/8649/8649605.png' className="w-6 h-6 mr-2" alt="bot" />
                  <p className="max-w-xs p-2 break-words bg-gray-300 rounded-lg">{message.text}</p>
                </div>
              )}
              {message.sender === 'user' && (
                <div className="flex items-center">
                  <p className="max-w-xs p-2 text-white break-words bg-blue-500 rounded-lg">{message.text}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="mt-4">
        <form onSubmit={handleSubmit} className="flex">
          <input
            ref={inputRef}
            type="text"
            className="px-4 py-2 border-2 border-gray-400 rounded-l focus:outline-none"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your question..."
  
          />
          <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-r">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Bot;
