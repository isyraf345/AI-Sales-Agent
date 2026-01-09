import { useChat } from '../context/ChatContext';
import { Users, MessageSquare } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ isOpen, onClose }) => {
  const { conversations, activeConversationId, setActiveConversationId } = useChat();

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    if (onClose) onClose();
  };

  return (
    <div className={clsx(
      "bg-white border-r border-gray-200 h-full flex flex-col",
      "lg:w-64",
      isOpen ? "absolute lg:relative w-64 z-50 shadow-lg lg:shadow-none" : "hidden lg:flex"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-600" />
          <h2 className="font-semibold text-gray-900">Conversations</h2>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {Object.values(conversations).map((conv) => {
          const lastMessage = conv.messages[conv.messages.length - 1];
          const isActive = conv.id === activeConversationId;
          
          return (
            <button
              key={conv.id}
              onClick={() => handleSelectConversation(conv.id)}
              className={clsx(
                "w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100",
                isActive && "bg-primary-50 border-l-4 border-l-primary-600"
              )}
            >
              <div className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                isActive ? "bg-primary-600" : "bg-gray-200"
              )}>
                <MessageSquare className={clsx(
                  "w-5 h-5",
                  isActive ? "text-white" : "text-gray-600"
                )} />
              </div>
              
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={clsx(
                    "font-medium truncate",
                    isActive ? "text-primary-900" : "text-gray-900"
                  )}>
                    {conv.name}
                  </h3>
                  {conv.intent && (
                    <span className={clsx(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      conv.intent.type === 'SALES' 
                        ? "bg-green-100 text-green-700" 
                        : "bg-blue-100 text-blue-700"
                    )}>
                      {conv.intent.type}
                    </span>
                  )}
                </div>
                
                {lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {lastMessage.text.substring(0, 40)}...
                  </p>
                )}
                
                {conv.messages.length === 0 && (
                  <p className="text-sm text-gray-400">No messages yet</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;