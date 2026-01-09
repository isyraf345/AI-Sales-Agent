import { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('conversations');
    return saved ? JSON.parse(saved) : {
      'customer-1': {
        id: 'customer-1',
        name: 'Customer A',
        messages: [],
        intent: null,
        userInfo: null,
        bookingStatus: null
      },
      'customer-2': {
        id: 'customer-2',
        name: 'Customer B',
        messages: [],
        intent: null,
        userInfo: null,
        bookingStatus: null
      },
      'customer-3': {
        id: 'customer-3',
        name: 'Customer C',
        messages: [],
        intent: null,
        userInfo: null,
        bookingStatus: null
      }
    };
  });

  const [activeConversationId, setActiveConversationId] = useState('customer-1');

  // Save to localStorage whenever conversations change
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  const addMessage = (conversationId, message) => {
    setConversations(prev => ({
      ...prev,
      [conversationId]: {
        ...prev[conversationId],
        messages: [...prev[conversationId].messages, message]
      }
    }));
  };

  const updateIntent = (conversationId, intent, confidence) => {
    setConversations(prev => ({
      ...prev,
      [conversationId]: {
        ...prev[conversationId],
        intent: { type: intent, confidence }
      }
    }));
  };

  const updateUserInfo = (conversationId, userInfo) => {
    setConversations(prev => ({
      ...prev,
      [conversationId]: {
        ...prev[conversationId],
        userInfo
      }
    }));
  };

  const updateBookingStatus = (conversationId, status) => {
    setConversations(prev => ({
      ...prev,
      [conversationId]: {
        ...prev[conversationId],
        bookingStatus: status
      }
    }));
  };

  const clearConversation = (conversationId) => {
    setConversations(prev => ({
      ...prev,
      [conversationId]: {
        ...prev[conversationId],
        messages: [],
        intent: null,
        bookingStatus: null
      }
    }));
  };

  const value = {
    conversations,
    activeConversationId,
    setActiveConversationId,
    activeConversation: conversations[activeConversationId],
    addMessage,
    updateIntent,
    updateUserInfo,
    updateBookingStatus,
    clearConversation
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};