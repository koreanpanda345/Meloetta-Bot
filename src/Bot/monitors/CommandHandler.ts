import { Message } from "discord.js";
import ServerSettings from "../../Database/Models/ServerSettings";
import { cache } from "../constants/instances";
import { createBotMonitor } from "../utils/helpers";

createBotMonitor({
	name: "command_handler",
	disabled: false,
	invoke: async (message: Message) => {

		let settings = await ServerSettings.findOne({guild_id: message.guildId}).exec();

		if(!settings) {
			settings = await ServerSettings.create({
				guild_id: message.guildId,
				prefix: process.env.DISCORD_BOT_PREFIX as string,
			});
		}

		if(!message.content.trim().toLowerCase().startsWith(settings.prefix as string)) return;
		console.log("success");
		let args = message.content.trim().slice(settings.prefix.length).trim().split(/ +/g);
		let cmdName = args.shift()?.toLowerCase() as string;

		let command = cache.commands.get(cmdName) || cache.commands.find((c) => c.aliases! && c.aliases.includes(cmdName));

		if(!command) return;

		if(command.disabled) {
			message.channel.send("This command is disabled");
			return;
		}
		
		try {
			await command.invoke(message, args);
		} catch (error) {
			command.disabled = true;
			cache.commands.set(command.name, command);
		}
	}
})