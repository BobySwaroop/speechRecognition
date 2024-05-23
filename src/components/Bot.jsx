import React, { useEffect, useState, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import mic from "../assets/7123011_google_mic_icon.svg";

const Bot = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState(["Hello! How can I assist you today?"]);
  const messagesEndRef = useRef(null);

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
      command: ['hello', 'hi', 'how are you', 'hey'],
      callback: () => addBotMessage('Hi! How can I assist you?'),
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
      command: 'what is machine learning',
      callback: () => addBotMessage('Machine learning (ML) is a branch of AI and computer science that focuses on the using data and algorithms to enable AI to imitate the way that humans'),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.8,
    
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
      command: 'NLP',
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
      command: 'what are you doing',
      callback: () => addBotMessage('Currently I am working as a software developer.')
    },
    // Add more commands as needed
  ];

  const {
    resetTranscript,
    listening,
  } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (listening) {
      setUserInput('');
    }
  }, [listening]);

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
      addBotMessage("how can i help you?");
    }
  };

  const addBotMessage = (message) => {
    setMessages(prev => [...prev, message]);
    speakMessage(message);
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
    e.preventDefault();
    if (userInput.trim() !== '') {
      setMessages(prev => [...prev, userInput]);
      handleQuery(userInput);
      setUserInput('');
    }
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>Your browser does not support speech recognition software. Please try using a different browser.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-4">
        <span className="font-bold">Listening:</span> {listening ? 'on' : 'off'}
        <div className='flex'>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded mr-2" type="button" onClick={resetTranscript}>Reset</button>
          <button type="button" onClick={listenContinuously}><img className="h-12 w-10" src={mic} alt="microphone" /></button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={SpeechRecognition.stopListening}>Stop</button>
        </div>
      </div>

      <div className='border-2 border-slate-400 w-96 h-96 overflow-y-auto' style={{ scrollbarWidth: 'thin' }}>
        <div className="h-full" style={{ overflowY: 'auto', scrollbarWidth: 'thin'}}>
          {messages.map((message, index) => (
            <div key={index} className={`flex justify-${index % 2 === 0 ? 'start' : 'end'} mb-2`}>
              <p className={`${index % 2 === 0 ? 'bg-blue-600 text-white' : 'bg-slate-400'} p-1 text-sm rounded`}>{message}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            className='border-2 border-gray-400 rounded-l px-2 py-1 focus:outline-none'
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your question..."
          />
          <button type="submit" className='bg-blue-600 text-white px-4 py-1 rounded-r'>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Bot;
