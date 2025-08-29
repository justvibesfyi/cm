import React from 'react';
import { MessageCircle, MessageSquare, Hash, Slack } from 'lucide-react';

interface PlatformIconProps {
  platform: 'telegram' | 'whatsapp' | 'discord' | 'slack';
  size?: number;
}

const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, size = 16 }) => {
  const iconProps = { size, className: getPlatformColor(platform) };

  switch (platform) {
    case 'telegram':
      return <MessageCircle {...iconProps} />;
    case 'whatsapp':
      return <MessageSquare {...iconProps} />;
    case 'discord':
      return <Hash {...iconProps} />;
    case 'slack':
      return <Slack {...iconProps} />;
    default:
      return <MessageCircle {...iconProps} />;
  }
};

const getPlatformColor = (platform: string): string => {
  switch (platform) {
    case 'telegram':
      return 'text-blue-500';
    case 'whatsapp':
      return 'text-green-500';
    case 'discord':
      return 'text-purple-500';
    case 'slack':
      return 'text-orange-500';
    default:
      return 'text-gray-500';
  }
};

export default PlatformIcon;