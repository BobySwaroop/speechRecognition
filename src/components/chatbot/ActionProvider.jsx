import React from 'react'

const ActionProvider = () => {
  return (
    <div>
      
    </div>
  )
}

export default ActionProvider
// const handleSpeak = () => {
//   if (inputText.trim() !== '') {
//     const utterance = new SpeechSynthesisUtterance(inputText);
  
//     utterance.onend = () => {
//       setIsSpeaking(false);
//       console.log("Speech synthesis completed.");
//       const synth = window.speechSynthesis.getVoices();
//       console.log(synth);
//       setspeakcompleted(true);
//     };
//     setIsSpeaking(true);
//     console.log("Starting speech synthesis.");
//     window.speechSynthesis.speak(utterance);
//   }
// };