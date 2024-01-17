// App.js

import React, { useState } from 'react'; 

//import messengerIcon2 from "./assets/messengerIcon2.png";
import { MESSENGERICON2_PATH } from './constantsFile';
import './App.css'

import Chatbot from './Chatbot'; // Adjust the path based on your project structure

function App() {
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const handleToggleChatbot = () => {
    console.log('Toggle chatbot visibility', chatbotVisible);
    setChatbotVisible(!chatbotVisible);
  }
  return (
        
         <div className='chat-app'>
          {chatbotVisible ? (
            <Chatbot onClose={() => setChatbotVisible(false)} />
          ) : (
            <img
            src={MESSENGERICON2_PATH}
            alt="Messenger"
            className='messenger-icon'
            onClick={handleToggleChatbot}
            style={{ width: '80px', height: '80px' }}
            />
          )} 

         </div>
          
          
        
  );
}

export default App;