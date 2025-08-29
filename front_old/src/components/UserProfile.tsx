import React from 'react';
import { User } from '../types';
import { Settings, LogOut } from 'lucide-react';

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center">
        <div className="relative flex-shrink-0 mr-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${getStatusColor(user.status)}`}></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{user.name}</h4>
          <p className="text-sm text-gray-500 truncate">{user.title}</p>
        </div>

        <div className="flex items-center space-x-1 ml-2">
          <button className="p-1.5 rounded-full hover:bg-gray-200 transition-colors">
            <Settings size={16} className="text-gray-600" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-gray-200 transition-colors">
            <LogOut size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;