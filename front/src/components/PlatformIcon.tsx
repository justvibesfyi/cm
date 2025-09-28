import type { Platform } from "@back/types";
import { Hash, Mail } from "lucide-react";
import type React from "react";
import Discord from "./social_media/discord.svg";
import Telegram from "./social_media/telegram.svg";
import WeChat from "./social_media/wechat.svg";
import WhatsApp from "./social_media/whatsapp.svg";
import Zalo from "./social_media/zalo.svg";

interface PlatformIconProps {
	platform: Platform;
	className: string;
}

const PlatformIcon: React.FC<PlatformIconProps> = (props) => {
	const { platform } = props;
	switch (platform) {
		case "telegram":
			return <Telegram {...props} />;
		case "whatsapp":
			return <WhatsApp {...props} />;
		case "discord":
			return <Discord {...props} />;
		case "zalo":
			return <Zalo {...props} />;
		case "email":
			return <Mail {...props} />;
		case "wechat":
			return <WeChat {...props} />;
		default:
			return <Hash {...props} />;
	}
};

export default PlatformIcon;
