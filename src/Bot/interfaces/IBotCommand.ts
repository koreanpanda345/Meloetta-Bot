import { Message } from "discord.js";

export interface IBotCommand {
	name: string;
	aliases?: string[];
	description?: string;
	usages?: string[];
	
	disabled?: boolean;

	guildOnly?: boolean;
	dmOnly?: boolean;

	invoke: (message: Message, args: string[]) => Promise<unknown>;
}