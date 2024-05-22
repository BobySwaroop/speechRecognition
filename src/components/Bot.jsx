import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Bot = () => {
  const [userInput, setUserInput] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [botResponse, setBotResponse] = useState('');
  
  const commands = [
    {
      command: 'reset',
      callback: () => resetTranscript()
    },
    {
      command: ['shut-up', 'exit', 'stop', 'chup karo', 'band karo'],
      callback: () => setBotResponse("i don't talk with you"),
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
      command: ['Hello', 'hii', 'hi', 'namestey', 'namastey', 'namastay'],
      callback: () => setBotResponse('Hi! My name is Chatbuddy. How can I assist you?')
    },
    {
      command: 'what is react js',
      callback: () => setBotResponse('React is a free and open-source front-end JavaScript library for building user interfaces based on components.'),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.5,
      bestMatchOnly: true
    },
    {
      command: 'what is python',
      callback: () => setBotResponse('Python is a high-level, general-purpose programming language. Python is dynamically typed and garbage-collected.'),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.5,
      bestMatchOnly: true
    },
    {
        command: 'nlp',
        callback: () => setBotResponse('Natural language processing (NLP) is a machine learning technology that gives computers the ability to interpret, manipulate, and comprehend human language.'),
        isFuzzyMatch: true,
        fuzzyMatchingThreshold: 0.5,
        bestMatchOnly: true
      },
      {
        command: 'what about alexa',
        callback: () => setBotResponse('Amazon Alexa or Alexa is a virtual assistant technology largely based on a Polish speech synthesizer named Ivona, bought by Amazon in 2013. '),
        isFuzzyMatch: true,
        fuzzyMatchingThreshold: 0.5,
        bestMatchOnly: true
      },
    
    {
      command: 'what are you doing',
      callback: () => setBotResponse('Currently I am working as a software developer.')
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

  useEffect(() => {
    handleUserQuery(userInput);
  }, [userInput]);

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
      command.callback(query);
    } else {
      setBotResponse("what can i help you");
    }
  };
  

  const speakMessage = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
  };
  useEffect(() => {
    if (botResponse) {
      speakMessage(botResponse);
    }
  }, [botResponse]);
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
      <div>
        {/* jkbksj */}
        <form onSubmit={(e) => {e.preventDefault(); setUserInput('')}}>
          <input 
            type="text" 
            value={userInput} 
            onChange={(e) => setUserInput(e.target.value)} 
            placeholder="Type your question..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Bot;
