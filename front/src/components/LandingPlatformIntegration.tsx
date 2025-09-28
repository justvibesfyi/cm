import PlatformIcon from './PlatformIcon';

const platforms = [
  { name: "Telegram", platform: 'telegram', users: "1 billion" },
  { name: "Zalo", platform: 'zalo', users: "80 million" },
  { name: "WhatsApp", platform: 'whatsapp', users: "3.1 billion" },
  { name: "Discord", platform: 'discord', users: "250 million" },
  { name: "WeChat", platform: 'wechat', users: "1.4 billion" },
  { name: "KakaoTalk", platform: 'kakaotalk', users: "50 million" },
];

const PlatformIntegrations = () => {
  return (
    <div className="w-full overflow-hidden">
      <div className="grid grid-cols-6 sm:grid-cols-3 md:grid-cols-6 gap-0 w-full">
        {platforms.map((platform, index) => (
          <div
            key={platform.platform}
            className={`
              flex flex-col items-center justify-center
              p-4 sm:p-5 md:p-6
              border border-gray-200
              transition-all duration-300 hover:scale-[1.01] hover:shadow-md
              ${index % 6 < 3 ? 'sm:border-r' : ''}
              ${index < 3 ? 'md:border-r' : ''}
              ${index % 2 === 0 ? 'sm:border-r-0' : ''}
            `}
          >
            <div className="mb-3 sm:mb-4">
              <PlatformIcon 
                className="w-8 h-8 sm:w-10 sm:h-10drop-shadow-lg" 
                platform={platform.platform} 
              />
            </div>
            <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 text-center">
              {platform.name}
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm font-medium">
              {platform.users} users
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformIntegrations;