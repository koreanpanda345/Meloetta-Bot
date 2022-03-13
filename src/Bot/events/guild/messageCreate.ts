import { createBotEvent } from "../../utils/helpers";
import { Message, TextChannel } from 'discord.js';
import { ShowdownClient } from "../../../Showdown/Client/ShowdownClient";
import { BattleSystem } from "../../systems/BattleSystem";
import { formatResultMessage } from './../../utils/formats';
import { BattleDataType } from "../../structures/BattleData";
import ServerSettings, { IServerSettings } from "../../../Database/Models/ServerSettings";
import { cache, client } from "../../constants/instances";
import LeagueSettings from "../../../Database/Models/LeagueSettings";

createBotEvent({
	name: 'messageCreate',
	invoke: async (message: Message) => {
		if(message.author.bot) return;

			let showdownBattleHandler = cache.monitors.get("showdown_battle");
			if(!showdownBattleHandler) {
				console.log("Showdown Battle Handler is missing");
				return;
			}

			if(showdownBattleHandler.disabled) {
				message.channel.send("There is something wrong with analyzing showdown battles. Please wait while it is being fixed.");
				return;
			}
			if(message.content.includes("play.pokemonshowdown.com")) {
				try {
					await showdownBattleHandler.invoke(message);
				} catch (error) {
					showdownBattleHandler.disabled = true;
					cache.monitors.set(showdownBattleHandler.name, showdownBattleHandler);
				}
			}

			const commandHandler = cache.monitors.get("command_handler");
			if(!commandHandler) {
				console.log("Command handler is missing");
				return;
			}
			if(commandHandler?.disabled) {
				message.channel.send("There is something wrong with the commands. Please wait while it is being fixed.");
				return;
			}

			try {
				await commandHandler.invoke(message);
			} catch (error) {
				commandHandler!.disabled = true;
				cache.monitors.set(commandHandler!.name, commandHandler);
			}
	}
})