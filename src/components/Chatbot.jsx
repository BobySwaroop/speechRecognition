import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import 'tailwindcss/tailwind.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userQuery, setUserQuery] = useState('');
  const [transcribing, setTranscribing] = useState(true);
  const [clearTranscriptOnListen, setClearTranscriptOnListen] = useState(true);
  const [finalTranscriptProcessed, setFinalTranscriptProcessed] = useState(false);
  const [userSaidName, setUserSaidName] = useState(false);
  const [userName, setUserName] = useState('');

  const toggleTranscribing = () => setTranscribing(!transcribing);
  const toggleClearTranscriptOnListen = () => setClearTranscriptOnListen(!clearTranscriptOnListen);

  const commands = [
    {
      command: 'reset',
      callback: () => resetTranscript()
    },
    {
      command: ['shut-up', 'exit', 'stop'],
      callback: () => addMessage({ user: false, text: "I wasn't talking." }),
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
      command: 'Hello',
      callback: () => addMessage({ user: false, text: 'Hi! My name is Chatbuddy. How can I assist you?' })
    },
    {
      command: 'what is react js',
      callback: () => addMessage({ user: false, text: 'React is a free and open-source front-end JavaScript library for building user interfaces based on components.' })
    },
    {
      command: 'what is python',
      callback: () => addMessage({ user: false, text: 'Python is a high-level, general-purpose programming language. Python is dynamically typed and garbage-collected.' })
    },
    {
      command: 'what are you doing',
      callback: () => addMessage({ user: false, text: 'Currently I am working as a software developer' })
    },
    {
      command: 'open *',
      callback: (websiteUrl) => {
        const trim = websiteUrl.replace(/\s/g, '');
        const urlToOpen = `https://${trim}.com`;
        const newTab = window.open(urlToOpen, '_blank');
        if (newTab) {
          newTab.focus();
          addMessage({ user: false, text: `Opening ${urlToOpen}` });
        } else {
          addMessage({ user: false, text: 'Popup blocker is preventing the website from opening. Please allow popups for this site.' });
        }
      },
      isFuzzyMatch: false // Disable fuzzy matching for this command
    },
    {
      command: ['go back', 'back'],
      callback: () => {
        window.history.back();
        addMessage({ user: false, text: 'Navigating back' });
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.5,
    },
    {
      command: ['go forward', 'forward'],
      callback: () => {
        window.history.forward();
        addMessage({ user: false, text: 'Navigating forward' });
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.5,
    },
    {
      command: '*name',
      callback: (name) => {
        if (name.toLowerCase().includes('my name is') || name.toLowerCase().includes('i am'))  {
          // Extract the name from the input
          const name = name
            .toLowerCase()
            .replace('my name is', '')
            .replace('i am', '')
            .trim();
    
          // Respond with a personalized message
          setUserName(name);
          addMessage({ user: false, text: `Nice to meet you, ${name}! How can I assist you today?` });
          setUserSaidName(true);
        } else {
          
        }
  

      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.5,
    },
  ];

  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true })
  }, []);

  const {
    transcript,
    resetTranscript,
    listening,
    interimTranscript,
    finalTranscript,
  } = useSpeechRecognition({ commands, transcribing, clearTranscriptOnListen });

  useEffect(() => {
    if (finalTranscript && !finalTranscriptProcessed) {
      setUserQuery(finalTranscript);
      handleUserQuery(finalTranscript);
      setFinalTranscriptProcessed(true);
    }
  }, [finalTranscript, finalTranscriptProcessed]);

  useEffect(() => {
    if (interimTranscript !== '') {
      console.log('Got interim result:', interimTranscript);
    }
    if (finalTranscript !== '') {
      console.log('Got final result:', finalTranscript);
    }
  }, [interimTranscript, finalTranscript]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.user) {
        speakMessage(lastMessage.text);
      }
    }
  }, [messages]);

  const handleUserQuery = (query) => {
    // Add the user's query to the message history
    addMessage({ user: true, text: query });
  
    // Check if the user input contains keywords related to introducing oneself
    if (query.toLowerCase().includes('my name is') || query.toLowerCase().includes('i am'))  {
      // Extract the name from the input
      const name = query
        .toLowerCase()
        .replace('my name is', '')
        .replace('i am', '')
        .trim();
  
      // Respond with a personalized message
      setUserName(name);
      addMessage({ user: false, text: `Nice to meet you, ${name}! How can I assist you today?` });
      setUserSaidName(true);
    } else if (!userSaidName && query.toLowerCase().includes('what is your name')) {
      // If the user hasn't introduced themselves and asks for the bot's name, respond with the bot's name
      addMessage({ user: false, text: "My name is Chatbuddy. How can I assist you today?" });
    } else if (query.toLowerCase() === 'hello') {
      // If the user greets the bot, respond with a greeting and ask for the user's name
      addMessage({ user: false, text: 'Hi! My name is Chatbuddy. What is your name?' });
    } else {
      // If none of the special conditions are met, check for other commands in the commands array
      const command = commands.find(cmd => {
        if (typeof cmd.command === 'string') {
          return query.toLowerCase().includes(cmd.command.toLowerCase());
        } else if (Array.isArray(cmd.command)) {
          return cmd.command.some(cmdItem => query.toLowerCase().includes(cmdItem.toLowerCase()));
        }
        return false;
      });
  
      // If a command is found, execute its callback function
      if (command) {
        command.callback();
      } else {
        // If no command is found, respond with a default message
        addMessage({ user: false, text: "I'm sorry, I didn't understand that." });
      }
    }
  
    // Reset the transcript and flag for the next input
    resetTranscript();
    setFinalTranscriptProcessed(false);
  };
  ;
  

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
if(listening){
  console.log(transcript);
  // addMessage(userQuery);
}
  const handleTypedQuery = () => {
    handleUserQuery(userQuery);
    setUserQuery('');
  };

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTypedQuery();
    }
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>Your browser does not support speech recognition software. Please try using a different browser.</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow p-4 overflow-y-scroll bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.user ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`p-2 rounded-lg ${msg.user ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center p-4 bg-white border-t">
        <input
          type="text"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type here..."
          className="flex-grow p-2 mr-2 border rounded-lg"
        />
        <button
          type="button"
          onClick={handleTypedQuery}
          className="p-2 text-white bg-blue-500 rounded-lg"
        >
          Send
        </button>
        <button
          type="button"
          onClick={listenContinuously}
          className="p-2 ml-2 text-white bg-green-500 rounded-lg"
        >
          Listen
        </button>
        <button
          type="button"
          onClick={SpeechRecognition.stopListening}
          className="p-2 ml-2 text-white bg-red-500 rounded-lg"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
