export interface Bet {
	id: string;
	event: string;
	creator: string;
	side: string;
	amount: number;
	status: string;
	createdAt: number;
	expiryMinutes?: number;
}

export interface Wallet {
	balance: number;
	currency: string;
}

export interface TelegramUser {
	id: string;
	name: string;
	username?: string;
}

export interface TelegramUser {
	id: string;
	name: string;
	username?: string; // optional
}
export interface WALLET {
	currency: string;
	balance: number;
}

export interface TelegramWebAppUser {
	id: number | string;
	first_name: string;
	username?: string;
}

export interface TelegramWebAppInitData {
	user?: TelegramWebAppUser;
}

export interface TelegramMainButton {
	setText: (text: string) => void;
	show: () => void;
}

export interface TelegramWebApp {
	initDataUnsafe?: { user?: TelegramWebAppUser };
	MainButton: TelegramMainButton;
}

export interface TelegramWindow extends Window {
	Telegram?: {
		WebApp: TelegramWebApp;
	};
}
