import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Menu, Trash2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { sendMessage } from '../services/api';
import MessageBubble from './MessageBubble';
import BookingButton from './BookingButton';

const ChatArea = ({ onMenuClick }) => {
  const { 
    activeConversation, 
    activeConversationId, 
    addMessage, 
    updateIntent,
    clearConversation 
  } = useChat();
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toISOString()
    };

    addMessage(activeConversationId, userMessage);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await sendMessage(userMessage.text);
      
      // Add bot response
      addMessage(activeConversationId, {
        sender: 'bot',
        text: response.reply,
        timestamp: new Date().toISOString()
      });

      // Update intent
      updateIntent(activeConversationId, response.intent, response.confidence);

      // Show hot lead indicator
      if (response.intent === 'SALES' && response.confidence > 0.8) {
        addMessage(activeConversationId, {
          sender: 'system',
          text: '🔥 Hot Lead Detected! High buying intent.',
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      addMessage(activeConversationId, {
        sender: 'system',
        text: '❌ Failed to send message. Please try again.',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear this conversation?')) {
      clearConversation(activeConversationId);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-semibold text-gray-900">
              {activeConversation?.name}
            </h2>
            {activeConversation?.intent && (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500">Intent:</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  activeConversation.intent.type === 'SALES'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {activeConversation.intent.type}
                </span>
                <span className="text-xs text-gray-500">
                  ({Math.round(activeConversation.intent.confidence * 100)}%)
                </span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleClear}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-600"
          title="Clear conversation"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeConversation?.messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">Start a conversation with {activeConversation.name}</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {activeConversation?.messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Booking Button */}
      {activeConversation?.intent?.type === 'SALES' && (
        <div className="px-4">
          <div className="max-w-4xl mx-auto">
            <BookingButton />
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows="1"
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;