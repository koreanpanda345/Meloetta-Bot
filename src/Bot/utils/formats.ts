import { MessageEmbed } from "discord.js";
import { BattleDataType } from "../structures/BattleData";

export function formatResultMessage(data: BattleDataType, battleId: string) {

	const embed = new MessageEmbed();
	embed.setTitle(`${data.players.get('p1')?.username} VS ${data.players.get('p2')?.username} Results`);
	embed.setURL(`https://replay.pokemonshowdown.com/${battleId}`);
	embed.setDescription(`||Winner: ${data.winner}\nScore: ${data.players.get('p1')?.score}-${data.players.get('p2')?.score}||`);

	let team1 = "";
	let csv = `||Winner: ${data.winner}\n`;
	csv += `Score: ${data.players.get('p1')?.score}-${data.players.get('p2')?.score}\n`;
	csv += "\n";
	csv += `${data.players.get('p1')?.username}'s Team\n`;
	for(const poke of data.players.get('p1')!.pokemons) {
		if(poke[1].name !== "") {
			team1 += `${poke[1].name}, has ${poke[1].kills} and ${poke[1].isDead ? 1 : 0} deaths\n`;
			csv += `${poke[1].name},${poke[1].kills},${poke[1].isDead ? 1: 0}\n`;
		}
	}
	csv += "\n\n";
	let team2 = "";
	csv += `${data.players.get('p2')?.username}\n`;
	for(const poke of data.players.get('p2')!.pokemons) {
		if(poke[1].name !== "") {
			team2 += `${poke[1].name}, has ${poke[1].kills} and ${poke[1].isDead ? 1 : 0} deaths\n`;
			csv += `${poke[1].name},${poke[1].kills},${poke[1].isDead ? 1 : 0}\n`;
		}

	}

	csv += "||\n";
	csv += `Replay: https://replay.pokemonshowdown.com/${battleId}\n`;
	
	embed.addField(`${data.players.get('p1')?.username}'s Team`, `||${team1}||`, true);
	embed.addField("\u200b", "\u200b", true);
	embed.addField(`${data.players.get('p2')?.username}'s Team`, `||${team2}||`, true);
	embed.addField("\u200b", "\u200b", true);
	embed.addField("CSV Data", `${csv}`, true);
	embed.setFooter({
		text: 'You can click on the title to view the replay.'
	});
	
	return embed;
}