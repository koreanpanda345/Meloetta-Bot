import { MessageEmbed, TextChannel } from "discord.js";
import LeagueSettings from "../../../Database/Models/LeagueSettings";
import { createBotCommand } from "../../utils/helpers";

createBotCommand({
	name: "edit",
	description: "Lets you edit your league's settings",
	disabled: false,
	invoke: async (message, args) => {
		if(!message.member?.permissions.has("MANAGE_GUILD")) return;

		let options: string[] = [
			"replay",
			"live"
		];

		if(!options.includes(args[0])) {

			return;
		}
		let leagues = await LeagueSettings.find({guild_id: message.guildId}).exec();
		let league = leagues.find(x => x!.live_links.channel_id === message.channelId);

		if(!league){
			message.channel.send("There doesn't seem to be a league maded yet.");
			return;
		}

		let embed = new MessageEmbed();
		switch(args[0]) {
			case "replay":
				
				let replay = message.mentions.channels.first() as TextChannel;
				if(!replay) {
					message.channel.send("Please try again, but mention the channel that you want to be the replay channel.");
					return;
				}
				embed.addField("Before", `<#${league.live_links.replay_channel}>`, true);
				league.live_links.replay_channel = replay.id;
				
				await league.save();
				embed.setTitle("Edited Replay Channel");

				embed.addField("After", `<#${league.live_links.replay_channel}>`, true);

				embed.setColor("GREEN");
				
				break;
			case "live":
				let live = message.mentions.channels.first() as TextChannel;
				if(!live) {
					message.channel.send("Please try again, but mention the channel that you want to be the live channel.");
					return;
				}
				embed.addField("Before", `<#${league.live_links.channel_id}>`, true);
				league.live_links.channel_id = live.id;

				await league.save();
				embed.setTitle("Edited Replay Channel");

				embed.addField("After", `<#${league.live_links.channel_id}>`, true);

				embed.setColor("GREEN");
		}

		message.channel.send({embeds: [embed]});
		
	}
})