export interface User {
    id: string;
    name: string;
    avatar: string;
    title: string;
    status: 'online' | 'offline' | 'away';
  }
  
  export interface Contact {
    id: string;
    name: string;
    avatar: string;
    platform: 'telegram' | 'whatsapp' | 'discord' | 'slack';
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isOnline: boolean;
  }
  
  export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: Date;
    type: 'text' | 'image' | 'file';
    isOwn: boolean;
  }