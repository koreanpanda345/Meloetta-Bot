import { Collection } from "discord.js";

export type BattleDataType = {
	winner: string;
  	players: Collection<string, BattlePlayerData>;
};

export type BattlePlayerData = {
	username: string;
	current_pokemon: BattlePokemonData;
	score: number;
	pokemons: Collection<string, BattlePokemonData>;
}

export type BattlePokemonData = {
	nickname: string;
	name: string;
	kills: number;
	isDead: boolean;
}