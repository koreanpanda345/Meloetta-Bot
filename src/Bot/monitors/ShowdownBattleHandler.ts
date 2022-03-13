import { Message, TextChannel } from "discord.js";
import LeagueSettings from "../../Database/Models/LeagueSettings";
import { ShowdownClient } from "../../Showdown/Client/ShowdownClient";
import { client } from "../constants/instances";
import { BattleSystem } from "../systems/BattleSystem";
import { formatResultMessage } from "../utils/formats";
import { createBotMonitor } from "../utils/helpers";

createBotMonitor({
	name: "showdown_battle",
	disabled: false,
	invoke: async (message: Message) => {

		let leagues = await LeagueSettings.find({guild_id: message.guildId}).exec();
		let league = leagues.find(x => x.live_links.channel_id === message.channelId);
		if(!league) {
			message.channel.send("There doesn't seem to be a league created yet.");
			return;
		}

		const showdown = new ShowdownClient({
			server: 'showdown',
			ip: 'sim.smogon.com',
			port: 8000,
			credentials: {
				username: process.env.SHOWDOWN_USERNAME as string,
				password: process.env.SHOWDOWN_PASSWORD as string
			}
		});
		try {
			showdown.on('ready', () => {
				console.log('Logged on to showdown');
				const id = message.content.split("play.pokemonshowdown.com/")[1];
				showdown.ws.joinBattle(id, (battle) => {
					message.channel.send(`Starting to analyze the battle with id of ${id}. I will let you know when I am done.`);
					const system = new BattleSystem(battle);
					battle.on("win", async () => {
						if(league?.live_links.replay_channel !== "") {
							const replayChannel = (await client.channels.fetch(league?.live_links.replay_channel as string) as TextChannel);
							message.channel.send(`Finished analyzing the battle with id of ${id}. Created report for the battle as well.`);
							replayChannel.send({embeds: [formatResultMessage(system.data, id)]});
						} else {
							message.channel.send(`Finished analyzing the battle with id of ${id}. Created report for the battle as well.`);
							message.channel.send({embeds: [formatResultMessage(system.data, id)]});
						}
	
						await showdown.ws.saveReplay(id);
						showdown.on("queryresponse", async (data) =>{
							let str = data.split("savereplay|")[1];
							let json = JSON.parse(str);
							await showdown.ws.requestReplay(json);
						})
					})
				})
			});
			showdown.connect();
		} catch (error) {
			// if(error) return;
			throw error;
		} 
	}
});