import clsx from 'clsx';
import { User, Bot } from 'lucide-react';

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-full max-w-md text-center">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(
      "flex gap-3 mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div className={clsx(
        "max-w-[70%] rounded-2xl px-4 py-2.5 break-words",
        isUser 
          ? "bg-primary-600 text-white rounded-tr-sm" 
          : "bg-gray-100 text-gray-900 rounded-tl-sm"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        {message.timestamp && (
          <span className={clsx(
            "text-xs mt-1 block",
            isUser ? "text-primary-100" : "text-gray-500"
          )}>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;