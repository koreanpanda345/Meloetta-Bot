import { Client, Collection, Intents } from "discord.js";
import { ShowdownClient } from "../../Showdown/Client/ShowdownClient";
import { IBotCommand } from "../interfaces/IBotCommand";
import { IBotEvent } from "../interfaces/IBotEvent";
import { IBotMonitor } from './../interfaces/IBotMonitor';

export const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES
	]
});

export const cache = {
	commands: new Collection<string, IBotCommand>(),
	events: new Collection<string, IBotEvent>(),
	monitors: new Collection<string, IBotMonitor>()
};

