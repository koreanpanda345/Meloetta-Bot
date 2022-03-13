import { Collection } from "discord.js";
import { ShowdownBattle } from "../../Showdown/Models/ShowdownBattle";
import { BattleDataType, BattlePlayerData, BattlePokemonData } from "../structures/BattleData";

export class BattleSystem {
	private _data: BattleDataType = {
		winner: "",
		players: new Collection<string, BattlePlayerData>()
	};
	constructor(private _battle: ShowdownBattle) {
		_battle.on('player', (player, username, avatar, rating) => {
			this._data.players.set(player, {
				username,
				score: 6,
				current_pokemon: {
					nickname: "",
					name: "",
					kills: 0,
					isDead: false
				},
				pokemons: new Collection<string, BattlePokemonData>()
			})
		});


		_battle.on('win', (user) => {
			this._data.winner = user;
			// console.log(this._data.players.get('p1')!.pokemons);
		});
		_battle.on('faint', (pokemon) => {
			if(!this._data.players.get(pokemon.player)?.pokemons.has(pokemon.pokemon)) {
				this._data.players.get(pokemon.player)?.pokemons.set(pokemon.pokemon, {
					nickname: pokemon.name || "",
					name: pokemon.pokemon,
					kills: 0,
					isDead: true
				});
			}
			this._data.players.get(pokemon.player)!.score--;
			this._data.players.get(pokemon.player === "p1" ? "p2" : "p1")!.current_pokemon.kills++;
			this._data.players.get(pokemon.player)!.current_pokemon.isDead = true;
		});

		_battle.on('switchAndDrag', (pokemon, hp) => {

			if(!this._data.players.get(pokemon.player)?.pokemons.has(pokemon.pokemon)) {
				this._data.players.get(pokemon.player)?.pokemons.set(pokemon.pokemon, {
					nickname: pokemon.name || "",
					name: pokemon.pokemon,
					kills: 0,
					isDead: false
				});
			}
			const player = pokemon.player;
			const current_name = this.data.players.get(player)!.current_pokemon.name;
			this._data.players.get(player)!.pokemons.set(current_name, this._data.players.get(player)!.current_pokemon);
			this._data.players.get(player)!.current_pokemon = this._data.players.get(player)!.pokemons.get(pokemon.pokemon)!;
		});
	}

	public get data() { return this._data};
}