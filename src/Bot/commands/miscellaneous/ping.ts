import { createBotCommand } from "../../utils/helpers";

createBotCommand({
	name: "ping",
	aliases: ["latency"],
	description: "Displays 'Pong!'",

	invoke: async (message, args) => {
		message.channel.send("Pong!");
	}
});