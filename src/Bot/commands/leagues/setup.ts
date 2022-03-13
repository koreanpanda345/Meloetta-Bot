import { Message, MessageEmbed } from "discord.js";
import LeagueSettings from "../../../Database/Models/LeagueSettings";
import { client } from "../../constants/instances";
import { createBotCommand } from "../../utils/helpers";

createBotCommand({
	name: "setup",
	description: "Setups a league.",
	
	invoke: async (message, args) => {
		if(!message.member?.permissions.has("MANAGE_GUILD")) return;
		let embed = new MessageEmbed();
		embed.setTitle("Creating a League");
		embed.setDescription("Please enter the league name. (If you would like to cancel the process at anytime, then type in cancel.)");
		embed.setColor("ORANGE");

		const filter = (m: Message) => m.author.id === message.author.id;
		const collector = await message.channel.createMessageCollector({filter, time: 10000000});
		message.channel.send({embeds: [embed]}).then(async (msg) =>{
			collector.on("collect", async m => {
				console.log(`${m.content}`);
				const league = await LeagueSettings.create({
					guild_id: message.guildId,
					league_name: m.content,
					live_links: {
						channel_id: message.channelId,
						replay_channel: message.channelId
					}
				});	
	
				embed = new MessageEmbed();
	
				embed.setTitle("Created a League");
				embed.setDescription(`League Name: ${league.league_name}\nLive Link Channel <#${league.live_links.channel_id}>\nReplay Channel: <#${league.live_links.replay_channel}>`);
				embed.setColor("GREEN");

				await msg.edit({embeds: [embed]});
			});
		} )

	}
})