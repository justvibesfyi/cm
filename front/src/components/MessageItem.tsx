import React from 'react';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
  showAvatar: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, showAvatar }) => {
  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  return (
    <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
      {!message.isOwn && showAvatar && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
      )}
      {!message.isOwn && !showAvatar && (
        <div className="w-8 h-8 flex-shrink-0"></div>
      )}
      
      <div className={`
        max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative
        ${message.isOwn 
          ? 'bg-blue-500 text-white rounded-br-md' 
          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
        }
      `}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p className={`
          text-xs mt-1 
          ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}
        `}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageItem;