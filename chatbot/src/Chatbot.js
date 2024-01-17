// Chatbot.js


import React, { useState, useRef, useEffect } from 'react';
import dataResponse from './dataresponse.json';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import { DELAY_TIME, PROJECTIMAGE_PATH, USERIMAGE_PATH, DEFAULT_HEADING ,DEFAULT_HEADING_FONT_SIZE, HEADING_COLOUR , BOT_BOX_COLOUR,USER_BOX_COLOUR, BACKGROUND_COLOUR, SEND_BUTTON_BACKGROUND_COLOR, WELCOME_MESSAGE, OPTION_COLOR,BUTTON_CIRCLE_COLOR  } from './constantsFile';



//import projectImage from './assets/projectimage.png';
//import userImage from './assets/userimage.png';

const formatDateTime = () => {
  const options = {  month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date().toLocaleString('en-US', options);
};
 const handleOptionHover = (event, backgroundColor, textColor) => {
  if (event.target.matches('.chat-button')){
    event.target.style.transition = 'background 0.3s, color 0.3s';
    event.target.style.backgroundColor = backgroundColor;
    event.target.style.color = textColor;
    setTimeout(() => {
      event.target.style.transition = 'background 0.3s';
    },300);
    event.target.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
  }
  };

function Chatbot({ onClose, headingText = DEFAULT_HEADING }) {
  
  const [userMessage, setUserMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [welcomeMessageShown, setWelcomeMessageShown] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(formatDateTime());
  const [isUserMessageSent, setIsUserMessageSent] = useState(false);
  const [refreshSession, setRefreshSession] = useState(false);
  
  const updateDateTime = () => {
    setCurrentDateTime(formatDateTime());
  };
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (!welcomeMessageShown) {
      setTimeout(() => {
        showWelcomeMessage();
        setWelcomeMessageShown(true);
      }, DELAY_TIME);
    }
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    if (!welcomeMessageShown && chatMessages.length === 1) {
      showOptions();
    }
  }, [welcomeMessageShown, chatMessages ]);

  const showWelcomeMessage = () => {
    setChatMessages([
      {
        role: 'bot',
        message: (
          <div>
            <p> {WELCOME_MESSAGE}</p>
          </div>
        ),
      },
    ]);
    showOptions();
    updateDateTime();
  };

  const showOptions = () => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'options',
        message: (
          <div className='options-container'>
            <div className='options-row'>
              <button className='chat-button' 
              style={{
                backgroundColor: 'white',
                color: OPTION_COLOR,
                border: `1px solid ${OPTION_COLOR}`,
              }} 
              onMouseEnter={(e) => handleOptionHover(e,OPTION_COLOR, 'white')}
              onMouseLeave={(e) => handleOptionHover(e,'white', OPTION_COLOR)}
              
              
              onClick={showRoleOptions}>
                Login
              </button>
              <span> </span>
              <button className='chat-button'  style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
              onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
              onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
              onClick={showRegistrationOptions}>
                Register
              </button>
              <span> </span>
              <button className='chat-button'   style={{background: 'white',color: OPTION_COLOR, border: `1px solid ${OPTION_COLOR}`,}} 
              onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
              onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
              onClick={showFAQs}>
                FAQ's
              </button>
              <span> </span>
            </div>
            <div className='options-row'>
              <button className='chat-button'   style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
              onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
              onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
              onClick={showContactUs}>
                Contact Us
              </button>
              <span> </span>
              <button className='chat-button'  style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
              onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
              onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
              onClick={showAboutUs}>
                AboutUs
              </button>
              <br></br>
            </div>
          </div>
        ),
      },
    ]);
  };

  const handleUserMessage = (e) => {
    setUserMessage(e.target.value);
  };
 
  

  const handleBackToMenu = () => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'user',
        message: (
          <div className='user-message'>
            <span>Back to Menu</span>
            <div className='tick-mark'>&#10004;</div>
          </div>
        ),
      },
      
    ]);

    setTimeout(() => {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'bot',
          message: (
            <div>
              <p>{WELCOME_MESSAGE}</p>
            </div>
          ),
        },
      ]);
      setWelcomeMessageShown(true);
      showOptions();
    }, DELAY_TIME);
  };
  

  const handleSendMessage = async () => {
    if (userMessage.trim() !== '') {
      const userMessageData = {
        role: 'user',
        message: (
          <div className='user-message'>
            <span>{userMessage}</span>
            {isUserMessageSent && <div className='tick-mark'>&#10004;</div>}
          </div>
        )
        
      };
      setChatMessages((prevMessages) => [...prevMessages, userMessageData]);
      chatContainerRef.current.scrollTop = 0;

      setTimeout(() => {
        const lowerCaseMessage = userMessage.toLowerCase();
        let botResponse;

        const textResponses = dataResponse.text_responses;
        for(const key in textResponses) {
          const question = textResponses[key].question.toLowerCase();
          if(lowerCaseMessage.includes(question) || question.includes(lowerCaseMessage)) {
            botResponse = [
              {
                role:'bot',
                message: textResponses[key].answer,
              },
              {
                role: 'options',
                message: (
                  <div className='options-container'>
                    <button className='back-to-menu-button' style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
                    onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
                    onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
                    onClick={handleBackToMenu}>
                      Back to Menu
                    </button>
                  </div>
                ),
              },
            ];
            break;
          }
        }
        if(!botResponse){

        if (lowerCaseMessage === 'hello' || lowerCaseMessage === 'hii') {
          botResponse = [
            {
              role: 'bot',
              message: dataResponse.hello,
            },
            {
              role: 'options',
              message: (
                <div className='options-container'>
                  <div className='options-row'>
                  <button className='chat-button' style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
                  onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
                  onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
                  onClick={() => handleOptionClick('login')}>Login</button>
                  <span>  </span>
                  <button className='chat-button' style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
                  onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
                  onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
                  onClick={() => handleOptionClick('register')}>Register</button>
                  <span>  </span>
                  <button className='chat-button'  style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}}
                  onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
                  onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
                  onClick={() => handleOptionClick('faqs')}>FAQs</button>
                  </div>
                  <div className='options-row'>
                    <button className='chat-button' style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
                    onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
                    onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
                    onClick={() => handleOptionClick('contactus')}>ContactUs</button>
                    <span> </span>
                    <button className='chat-button' style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
                    onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
                    onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
                    onClick={() => handleOptionClick('abouts')}>AboutUs</button>
                  </div>
                </div>
              ),
            },
            
          ];
        } else {
          

          if (lowerCaseMessage === 'login') {
            botResponse = [
              {
                role: 'bot',
                message: dataResponse.login.question,
              },
              {
                role: 'options',
                message: (
                  <div className='options-container'>
                    <div className='options-row'>
                      {dataResponse.login.options.map((option, index) => (
                        <button
                          key={index}
                          className='chat-button'
                          onClick={() => handleRoleSelection(option.role)}
                        >
                          {option.text}
                        </button>
                      ))}
                    </div>
                  </div>
                ),
              },
            ];
          } else if (lowerCaseMessage === 'register') {
            botResponse = [];
            handleTeacherRegistration();

              
            
          } else if(lowerCaseMessage === 'faqs') {
            botResponse = [];
            handlefaqslink();

          }   
          
          
           else {
            botResponse = [
              {
                role: 'bot',
                message: "I'm sorry, I didn't understand. Can you please rephrase your words!",
              },
              {
                role: 'options',
                message: (
                  <div className='options-container'>
                    <button className='back-to-menu-button' style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
                   onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
                   onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
                    onClick={handleBackToMenu}>
                      Back to Menu
                    </button>
                  </div>
                ),
              },
            ];
          }
        }
      }

        setChatMessages((prevMessages) => [...prevMessages, ...botResponse]);
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, DELAY_TIME);

      setUserMessage('');
      setIsUserMessageSent(true);
    }
  };

  const handleOptionClick = (option) => {
    if (option === 'login') {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'bot',
          message: dataResponse.login.question,
        },
        {
          role: 'options',
          message: (
            <div className='options-container'>
              <div className='options-row'>
              <button className='chat-button' style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}}  
              onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
              onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
              onClick={() => handleRoleSelection('Student')}>Student</button>
              <button className='chat-button' style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
              onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
              onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
              onClick={() => handleRoleSelection('Teacher')}>Teacher</button>
              </div>
            </div>
          ),
        },
      ]);
    } else if (option === 'register') {
      // Handle "register" option...
      
    } else if (option === 'faqs') {
      // Handle "faqs" option...
    }
  };

  const showRoleOptions = () => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'user',
        message: (
          <div className='user-message'>
            <span>Login</span>
            <div className='tick-mark'>&#10004;</div>
          </div>
        ),
      },
    ]);
    setTimeout(() => {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'bot',
          message: 'Are you a ?',
        },
        {
          role: 'options',
          message: (
            <div className='options-container'>
            <div className='options-row'>
              <button className='chat-button'  style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
              onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
              onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
              onClick={() => handleRoleSelection('Student')}>Student</button>
              <span>  </span>
              <button className='chat-button' style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
              onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
              onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
              onClick={() => handleRoleSelection('Teacher')}>Teacher</button>
              </div>
            </div>
          ),
        },
      ]);
    }, DELAY_TIME);
  };

  const handleRoleSelection = (selectedRole) => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'user',
        message: (
          <div className='user-message'>
            <span>{selectedRole}</span>
            <div className='tick-mark'>&#10004;</div>
          </div>
        ),
      },
    ]);
    setTimeout(() => {
      if (selectedRole === 'Student') {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          
          {
            role: 'bot',
            message: (
              <div>
              <p>
                {dataResponse.student_login.text} <br />
                <a href={dataResponse.student_login.link} target='_blank' rel= 'noopener noreferrer'>
                {dataResponse.student_login.linkText}
                </a> 
              </p>
              </div>
            ),
          },
          {
            role: 'options',
            message: (
              <div className='options-container'>
                <button className='back-to-menu-button' style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
                onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
                onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
                onClick={handleBackToMenu}>
                  Back to Menu
                </button>
              </div>
            ),
          },
        ]);
      } else if (selectedRole === 'Teacher') {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          {
            role: 'bot',
            message: (
              <div>
              <p>
                {dataResponse.teacher_login.text} <br />
                <a href={dataResponse.teacher_login.link} target='_blank' rel= 'noopener noreferrer'>
                {dataResponse.teacher_login.linkText}
                </a> 
              </p>
              </div>
            ),
          },
          {
            role: 'options',
            message: (
              <div className='options-container'>
                <button className='back-to-menu-button' style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
                onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
                onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
                onClick={handleBackToMenu}>
                  Back to Menu
                </button>
              </div>
            ),
          },
          
        ]);
      }
    }, DELAY_TIME);
  };

  

  const handleTeacherRegistration = () => {
    setTimeout(() => {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'bot',
          message: (
            <div>
              <p>Here is the Register link of Teacher:</p>
              <a href={dataResponse.register.teacher_link.link} target='_blank' rel='noopener noreferrer'>
                {dataResponse.register.teacher_link.linkText}
              </a>
            </div>
          ),
        },
        {
          role: 'options',
          message: (
            <div className='options-container'>
              <button className='back-to-menu-button' style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
              onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
              onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
              onClick={handleBackToMenu}>
                Back to Menu
              </button>
            </div>
          ),
        },
      ]);
    }, DELAY_TIME);
    // Handle teacher registration...
  };

  const handlefaqslink = () => {
    setTimeout(() => {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'bot',
          message: (
            <div> 
              <p>{dataResponse.faqs.faq_link.text}</p>
              <a href={dataResponse.faqs.faq_link.link} target='_blank' rel='noopener noreferrer'>
                {dataResponse.faqs.faq_link.text}
              </a>
            </div>
          ),
        },
        {
          role: 'options',
          message: (
            <div className='options-container'>
              <button className='back-to-menu-button' style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
              onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
              onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
              onClick={handleBackToMenu}>
                Back to Menu
              </button>
            </div>
          ),
        },
      ]);
    }, DELAY_TIME);
  }

  const showRegistrationOptions = () => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'user',
        message: (
          <div className='user-message'>
            <span> Register </span>
            <div className='tick-mark'>&#10004;</div>
          </div>
        ),
      },
    ]);
  
    // Introduce a delay using setTimeout before showing the registration options
    setTimeout(() => {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'bot',
          message: (
            <div>
              <p>Here is the Register link of Teacher:</p>
              <a href={dataResponse.register.teacher_link.link} target='_blank' rel='noopener noreferrer'>
                {dataResponse.register.teacher_link.linkText}
              </a>
            </div>
          ),
        },
        {
          role: 'options',
          message: (
            <div className='options-container'>
              <button className='back-to-menu-button' style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
              onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
              onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
              onClick={handleBackToMenu}>
                Back to Menu
              </button>
            </div>
          ),
        },
      ]);
    }, DELAY_TIME); // Adjust the delay time (in milliseconds) as needed
  };
  

  const showFAQs = () => {
   setChatMessages((prevMessages) => [
    ...prevMessages,
    {
      role: 'user',
      message: (
        <div className='user-message'>
          <span>FAQs</span>
          <div className='tick-mark'>&#10004;</div>
        </div>
      ),
    },
   ]);
   setTimeout(() => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'bot',
        message: (
          <div> 
            <p>Here is the FAQ link,Click Below:</p>
            <a href={dataResponse.faqs.faq_link.link} target='_blank' rel='noopener noreferrer'>
              {dataResponse.faqs.faq_link.text}
            </a>
          </div>
        ),
      },
      {
        role: 'options',
        message: (
          <div className='options-container'>
            <button className='back-to-menu-button' style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
            onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
            onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
            onClick={handleBackToMenu}>
              Back to Menu
            </button>
          </div>
        ),
      },
    ]);
   },DELAY_TIME)
  };

  const showContactUs = () => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'user',
        message: (
          <div className='user-message'>
            <span>Contact Us</span>
            <div className='tick-mark'>&#10004;</div>
          </div>
        ),
      },
      {
        role: 'bot',
        message: (
          <div>
            <p>{dataResponse.contactUs.text}</p>
            <p>Email: {dataResponse.contactUs.email}</p>
            <p>Phone: {dataResponse.contactUs.phone}</p>
          </div>
        ),
      },
      {
        role: 'options',
        message: (
          <div className='options-container'>
            <button className='back-to-menu-button' style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
            onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
            onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
            onClick={handleBackToMenu}>
              Back to Menu
            </button>
          </div>
        ),
      },
    ]);
  };

 // ...

const showAboutUs = () => {
  setChatMessages((prevMessages) => [
    ...prevMessages,
    {
      role: 'user',
      message: (
        <div className='user-message'>
          <span>About Us</span>
          <div className='tick-mark'>&#10004;</div>
        </div>
      ),
    },
  ]);

  // Introduce a delay using setTimeout before showing the About Us link
  setTimeout(() => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'bot',
        message: (
          <div>
            <p>{dataResponse.aboutus.about_link.text}</p>
            <a href={dataResponse.aboutus.about_link.link} target='_blank' rel='noopener noreferrer'>
              {dataResponse.aboutus.about_link.link}
            </a>
          </div>
        ),
      },
      {
        role: 'options',
        message: (
          <div className='options-container'>
            <button className='back-to-menu-button'  style={{background: 'white',color: OPTION_COLOR,border: `1px solid ${OPTION_COLOR}`,}} 
            onMouseEnter={(e) => handleOptionHover(e, OPTION_COLOR, 'white')}
            onMouseLeave={(e) => handleOptionHover(e, 'white', OPTION_COLOR)}
            onClick={handleBackToMenu}>
              Back to Menu
            </button>
          </div>
        ),
      },
    ]);
  }, DELAY_TIME); // Adjust the delay time (in milliseconds) as needed
};

const handleRefreshSession = () => {
  setChatMessages([]);
 setRefreshSession(true);
  setTimeout(() => {
    setRefreshSession(false);
    showWelcomeMessage();
  },DELAY_TIME);
};



  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  // Your existing code...
  const chatboxStyle = {
    width: isFullScreen ? '100vw' : '500px',
    height: isFullScreen ? '100vh' : '500px',
    backgroundColor: BACKGROUND_COLOUR,
    display: 'flex',
    flexDirection: 'column',
   
    
  }; 

  const messagesContainerStyle = {
    flex: 1,
    overflowY: 'auto',
    width: isFullScreen ? '100vw' : '100%',  //update width to 100% for full-screen
    height: isFullScreen ? 'calc(100% - 40px)' : 'calc(100% - 120px)',
    zIndex: '9999',
   };

  const containerStyle = {
    position: 'fixed',
    top: '0',
    right: '0',
    width: isFullScreen ? '100vw' : '500px',
    height: isFullScreen ? '100vh' : 'auto',
    
    zIndex: '9999',
    
   
  }

return (
  <div className="chatbox-container" style={containerStyle}>
    <div className="chatbox" style={{ ...chatboxStyle, display: 'flex', flexDirection: 'Column' }}>
      <div className='chatbox-heading' style={{ backgroundColor: HEADING_COLOUR, padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center',height: '50px',}}>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
        <img src={PROJECTIMAGE_PATH} alt="projectImage" style={{ width: '50px', marginRight: '10px', fontSize: '10em' }} />
        <h1 style={{ color: 'white', textAlign: 'left',marginTop: '5px',fontSize: DEFAULT_HEADING_FONT_SIZE }}>{headingText}</h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center',marginTop: '5px' }}>
        <div className='refresh-button' onClick={handleRefreshSession} style={{ backgroundColor: BUTTON_CIRCLE_COLOR, border: 'none', cursor: 'pointer', borderRadius: '50%', height: '1.7em', width: '1.7em', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '4px' }}>
      <FontAwesomeIcon icon={faSyncAlt} style={{ color: 'white', fontSize: '1em' }} />
    </div>
        <div className='close-button' onClick={onClose} style={{ backgroundColor: BUTTON_CIRCLE_COLOR, border: 'none', cursor: 'pointer', borderRadius: '50%', height: '1.7em', width: '1.7em', display: 'flex', justifyContent: 'center', alignItems: 'center',marginRight: '4px' }}>
          <span style={{ color: 'white', fontSize: '1em' }}>X</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center',marginTop: '5px' }}>
        <button className='fullscreen-button' onClick={toggleFullScreen} style={{ backgroundColor: BUTTON_CIRCLE_COLOR, border: 'none', cursor:'pointer', borderRadius: '50%', height: '2em',width: '2em', display: 'flex', justifyContent: 'center', alignItems: 'center',color: 'white',marginRight: '4px' }}>
        {isFullScreen ? <FontAwesomeIcon icon={faCompress} style={{ fontSize: '1em'}} /> : <FontAwesomeIcon icon={faExpand} style={{ fontSize: '1em'}} />}
       </button>
       </div> 
       </div> 
      </div>
      <div className="chat-messages" ref={chatContainerRef} style={messagesContainerStyle}>
        {chatMessages.map((msg, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
            {msg.role === 'bot' && (
              <div className='avatar-container bot-avatar' style={{ fontSize: '1.2em', marginRight: '10px', float: 'left', }}>
                <img src={PROJECTIMAGE_PATH} alt="projectImage" className='bot-image' style={{ display: 'block', margin: '0 auto' }} />
              </div>
            )}
            <div
              className={`chat-message ${msg.role === 'user' ? 'user' : msg.role === 'options' ? 'options' : 'bot'}`}
              style={{
                fontSize: '1em',
                color: msg.role === 'user' ? 'black' : 'black',
                borderRadius: msg.role === 'user' ? '8px' : '8px',
                padding: '8px',
                maxWidth: '60%',
                maxHeight: '50%',
                marginLeft: msg.role === 'user' ? 'auto' : '0',
                backgroundColor: msg.role === 'user' ? USER_BOX_COLOUR : msg.role === 'bot' ? BOT_BOX_COLOUR : 'transparent',
                textAlign: msg.role === 'user' ? 'right' : 'left',
                position: 'relative',
                //border: msg.role === 'bot' ? `1px solid ${BOT_BOX_COLOUR}` : 'none', // Add border for bot messages
              }}
            >
              {msg.message}
            </div>
            {msg.role === 'user' && (
              <div className='avatar-container user-avatar' style={{ fontSize: '1.2em', marginLeft: '10px', float: 'right', position: 0, }}>
                <img src={USERIMAGE_PATH} alt="User" className='userimage' />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="App" style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }} >
        <input
          type="text"
          value={userMessage}
          onChange={handleUserMessage}
          placeholder="Ask me something.."
          autoComplete='off'
          style={{ width: 'calc(100% - 50px)', height: '1em', fontSize: '1.2em', marginRight: '0', paddingLeft: '8px', borderRadius: '8px' }}
        />
        <button
          onClick={handleSendMessage}
          className='send-button'
          style={{ backgroundColor: SEND_BUTTON_BACKGROUND_COLOR, border: 'none', cursor: 'pointer',fontSize: '1.5em', borderRadius: '8px', height: '1.5em', display: 'flex', justifyContent: 'center', alignItems: 'center', }}
        >
          <span style={{ fontSize: '30px', textAlign: 'center' }}>&#11166;</span>
        </button>
      </div>
      <div style={{ fontSize: '0.8em', color: 'gray', textAlign: 'center', marginTop: '5px' }}>{currentDateTime}</div>
    </div>
  </div>
);

}

export default Chatbot;