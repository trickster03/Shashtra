import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { websocketConnect, websocketDisconnect } from '../redux/features/webSocket/webSocketSlice';
// Material UI imports
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  CircularProgress,
  IconButton,
  Avatar,
  Slide,
  Dialog,
  DialogContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';
import Sidebar from '../components/sidebar';
import LockIcon from '@mui/icons-material/Lock';

// Add these styled components at the top of your file
const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: '1px solid rgba(255, 153, 51, 0.2)',
  background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.1), rgba(255, 255, 255, 0.95))',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(255, 153, 51, 0.1)',
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9))',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 153, 51, 0.05)',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 153, 51, 0.2)',
    borderRadius: '10px',
    '&:hover': {
      background: 'rgba(255, 153, 51, 0.3)',
    },
  },
}));

const MessageBubble = styled(Box)(({ theme, sender }) => ({
  maxWidth: '70%',
  padding: theme.spacing(2),
  borderRadius: '16px',
  position: 'relative',
  marginLeft: sender === 'user' ? 'auto' : '0',
  marginRight: sender === 'user' ? '0' : 'auto',
  background: sender === 'user' 
    ? 'linear-gradient(135deg, #FF9933, #f97316)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))',
  color: sender === 'user' ? '#fff' : '#333',
  boxShadow: sender === 'user'
    ? '0 4px 12px rgba(255, 153, 51, 0.2)'
    : '0 4px 12px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(10px)',
  border: sender === 'user' 
    ? 'none'
    : '1px solid rgba(255, 153, 51, 0.1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '12px',
    height: '12px',
    background: 'inherit',
    border: sender === 'user' ? 'none' : '1px solid rgba(255, 153, 51, 0.1)',
    borderRight: sender === 'user' ? 'none' : '0',
    borderBottom: sender === 'user' ? 'none' : '0',
    left: sender === 'user' ? 'auto' : '-6px',
    right: sender === 'user' ? '-6px' : 'auto',
    transform: sender === 'user' 
      ? 'translateY(-50%) rotate(-45deg)'
      : 'translateY(-50%) rotate(-45deg)',
  },
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderTop: '1px solid rgba(255, 153, 51, 0.2)',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 153, 51, 0.05))',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 -4px 20px rgba(255, 153, 51, 0.1)',
}));

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newSessionAnimation, setNewSessionAnimation] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const dispatch = useDispatch();
  const socketRef = useRef(null); // Reference to the WebSocket
  const [isThinking, setIsThinking] = useState(false);  // Add this new state

  // Check for token validity
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setOpenLoginDialog(true);
    }
  }, []);

  // Add a dependency array to prevent infinite re-renders
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load initial data from localStorage or query params
  useEffect(() => {
    const loadInitialData = () => {
      const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      const sessionIdFromQuery = new URLSearchParams(location.search).get('session_id');

      if (sessionIdFromQuery) {
        const newSession = {
          id: sessionIdFromQuery,
          name: `Chat ${savedSessions.length + 1}`,
          createdAt: new Date().toISOString()
        };
        setCurrentSession(newSession);
        setChatSessions([...savedSessions, newSession]);
        localStorage.setItem('chatSessions', JSON.stringify([...savedSessions, newSession]));
        dispatch(websocketConnect(`wss://your-websocket-url/api/chat?session_id=${sessionIdFromQuery}`));
      } else if (savedSessions.length > 0) {
        setChatSessions(savedSessions);
        setCurrentSession(savedSessions[0]);
        const savedMessages = JSON.parse(localStorage.getItem(`messages_${savedSessions[0].id}`) || '[]');
        setMessages(savedMessages);
      }
    };

    loadInitialData();
  }, [location.search, dispatch]);

  // Load messages for the current session
  useEffect(() => {
    if (currentSession) {
      // Connect to WebSocket when the component mounts
      socketRef.current = new WebSocket(`wss://shastra-service-410805250566.us-central1.run.app/api/chat?session_id=${currentSession.id}`);

      socketRef.current.onopen = () => {
        console.log('WebSocket connection established');
      };

      socketRef.current.onmessage = (event) => {
        let newMessage;

        // Try to parse the incoming message as JSON
        try {
          newMessage = JSON.parse(event.data);
        } catch (error) {
          console.warn('Received non-JSON message:', event.data); // Log the non-JSON message
          newMessage = { content: event.data, sender: 'ai', timestamp: new Date().toISOString() }; // Create a message object
        }

        console.log('Received message:', newMessage); // Log the incoming message
        setMessages((prevMessages) => [...prevMessages, newMessage]); // Update state with the new message
        setIsThinking(false); // Stop loading indicator when response received
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error); // Log any errors
      };

      socketRef.current.onclose = () => {
        console.log('WebSocket connection closed');
      };

      // Cleanup function to disconnect when the component unmounts
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }
  }, [currentSession]);

  const createNewSession = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setOpenLoginDialog(true);
      return;
    }

    try {
      const randomSessionId = `session_${Math.random().toString(36).substr(2, 9)}`; // Generate a random session ID
      setNewSessionAnimation(true);
      
      const newSession = {
        id: randomSessionId,
        name: `Chat ${chatSessions.length + 1}`,
        createdAt: new Date().toISOString()
      };
      
      const updatedSessions = [newSession, ...chatSessions];
      setChatSessions(updatedSessions);
      setCurrentSession(newSession);
      setMessages([]);
      
      // Save to localStorage
      localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
      localStorage.setItem(`messages_${newSession.id}`, JSON.stringify([]));
      
      // Connect to WebSocket
      dispatch(websocketConnect(`wss://your-websocket-url/api/chat?session_id=${randomSessionId}`));
      
      setTimeout(() => {
        setNewSessionAnimation(false);
      }, 1000);
    } catch (error) {
      console.error('Error creating new session:', error);
      setNewSessionAnimation(false);
    }
  };

  // Ensure handleLogout and formatDate are defined
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short', 
      day: 'numeric'
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentSession) return;

    const userMessage = {
      id: Date.now(),
      content: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsThinking(true); // Start loading indicator

    // Send the message to the WebSocket
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify(userMessage));
    }
    
    localStorage.setItem(`messages_${currentSession.id}`, JSON.stringify([...messages, userMessage]));
  };

  // Add this new component for the thinking indicator
  const ThinkingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MessageBubble sender="ai">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} thickness={5} sx={{ color: '#666' }} />
          <Typography sx={{ color: '#666' }}>Thinking...</Typography>
        </Box>
      </MessageBubble>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCreateNewSession={createNewSession}
        onLogout={handleLogout}
        navigate={navigate}
      />
      
      {/* Main Content - ChatGPT-like Interface */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex-1 flex flex-col h-screen bg-gradient-to-br from-[#FF9933]/5 via-white to-[#138808]/5 backdrop-blur-sm relative z-10"
      >
        {/* Menu Button for Mobile */}
        <IconButton
          className="block lg:hidden absolute top-4 left-4 z-50"
          onClick={() => setSidebarOpen(true)}
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
            boxShadow: '0 2px 8px rgba(255, 153, 51, 0.15)',
            display: { lg: 'none' }
          }}
        >
          <MenuIcon sx={{ color: '#FF9933' }} />
        </IconButton>
        
        {currentSession ? (
          <Box className="flex flex-col h-full">
            <ChatHeader>
              <Box className="flex items-center justify-between">
                <Box className="flex items-center gap-3 ml-14 lg:ml-0"> {/* Add margin-left for mobile */}
                  <Avatar 
                    sx={{ 
                      bgcolor: 'transparent',
                      background: 'linear-gradient(135deg, #FF9933, #138808)',
                      color: 'white',
                    }}
                  >
                    {currentSession.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" className="font-bold text-amber-900">
                      {currentSession.name}
                    </Typography>
                    <Typography variant="caption" className="text-amber-700">
                      {formatDate(currentSession.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </ChatHeader>

            <MessageContainer>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MessageBubble sender={message.sender}>
                    <Typography>{message.content}</Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        opacity: 0.7,
                        display: 'block',
                        textAlign: message.sender === 'user' ? 'right' : 'left',
                        mt: 1
                      }}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </Typography>
                  </MessageBubble>
                </motion.div>
              ))}
              {isThinking && <ThinkingIndicator />}
              <div ref={messageEndRef} />
            </MessageContainer>

            <InputContainer>
              <form onSubmit={sendMessage} className="flex gap-2">
                <TextField
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  fullWidth
                  variant="outlined"
                  size="medium"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(255, 153, 51, 0.3)',
                        borderWidth: '1px',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 153, 51, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF9933',
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputBase-input': {
                      padding: '14px 16px',
                      fontSize: '1rem',
                    },
                  }}
                />
                <Button 
                  type="submit" 
                  variant="contained"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  sx={{ 
                    borderRadius: '12px',
                    minWidth: '120px',
                    boxShadow: '0 4px 12px rgba(255, 153, 51, 0.2)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '12px 24px',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(255, 153, 51, 0.3)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                  endIcon={<SendIcon />}
                >
                  Send
                </Button>
              </form>
            </InputContainer>
          </Box>
        ) : (
          <Box className="flex-1 flex items-center justify-center p-8">
            {/* Add margin-top for mobile view to account for menu button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mt-8 lg:mt-0"
            >
              <Avatar
                sx={{ 
                  width: 80,
                  height: 80,
                  margin: '0 auto 24px',
                  background: 'linear-gradient(135deg, #FF9933, #138808)',
                }}
              >
                <ChatBubbleOutlineIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" className="font-bold text-amber-900 mb-3">
                Welcome to Shastra Chat
              </Typography>
              <Typography variant="body1" className="text-amber-700 mb-6 max-w-md mx-auto">
                Start a new conversation to explore Indian knowledge and wisdom.
              </Typography>
              <Button
                onClick={createNewSession}
                variant="contained"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                sx={{ 
                  borderRadius: '12px',
                  padding: '12px 24px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                }}
                startIcon={<AddIcon />}
              >
                New Conversation
              </Button>
            </motion.div>
          </Box>
        )}
      </motion.div>

      {/* Login Dialog */}
      <Dialog 
        open={openLoginDialog} 
        disableEscapeKeyDown 
        PaperProps={{ 
          style: { 
            width: '400px', 
            borderRadius: '16px',
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98))',
            boxShadow: '0 8px 32px rgba(255, 153, 51, 0.15)',
          } 
        }}
      >
        <DialogContent sx={{ 
          textAlign: 'center', 
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3
        }}>
          <Avatar
            sx={{ 
              width: 70,
              height: 70,
              backgroundColor: 'transparent',
              background: 'linear-gradient(135deg, #FF9933, #f97316)',
              marginBottom: 2
            }}
          >
            <LockIcon sx={{ fontSize: 35, color: 'white' }} />
          </Avatar>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600,
              color: '#1a1a1a',
              marginBottom: 1
            }}
          >
            Authentication Required
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666',
              marginBottom: 3,
              maxWidth: '280px'
            }}
          >
            Please log in to access the chat features and start your conversation
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/auth/login')} 
            fullWidth
            sx={{ 
              background: 'linear-gradient(135deg, #FF9933, #f97316)', 
              color: 'white', 
              padding: '12px',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              '&:hover': { 
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.25)'
              } 
            }}
          >
            Login to Continue
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
