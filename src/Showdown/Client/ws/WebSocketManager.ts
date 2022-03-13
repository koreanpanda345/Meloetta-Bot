import axios from "axios";
import { emit } from "process";
import { stringify } from "querystring";
import * as ws from "ws";
import ReadyAction from "../../Actions/Client/ReadyAction";
import { ClientURLs } from "../../constants/clientConstants";
import { ShowdownBattle } from "../../Models/ShowdownBattle";
import { ShowdownClient } from "../ShowdownClient";
import { ShowdownSettings } from "../types/ShowdownSettings";

export class WebSocketManager {
	private _ws: ws;

	constructor(private _client: ShowdownClient, private _settings: ShowdownSettings) {
		this._ws = new ws(`ws://${this._settings.ip}:${this._settings.port}/showdown/websocket`);
	}

	public async connect() {
		this._ws.on('open', (_: WebSocket) => {
			this._client.emit('connected');
			this._ws.on('message', async (data) => {
				this._client.emit('debug', data.toString());
				await this.processCommand(data.toString());
			});
		}).on('error', (err) => {
			this._client.emit('error',err);
		}).on('close', (code, reason) => {
			this._client.emit('disconnected', code, reason.toString());
		});
	}

	private createLoginData(username: string, password: string, nonce: string) {
		return stringify({
			act: 'login',
			name: username.replace(/ +/g, '').toLowerCase(),
			pass: password,
			challstr: nonce
		});
	}

	private async login(nonce: string) {
		const url = ClientURLs.LoginUrl.replace('<>', this._settings.server);
		const data = this.createLoginData(this._settings.credentials.username, this._settings.credentials.password, nonce);

		const response = await axios.post(url, data);

		let json;

		try {
			json = JSON.parse((response.data as string).substring(1));
		} catch (error) {
			console.log(error);
		}

		return json;
	}

	public async sendCommand(command: string, data: string[]) {
		const cmd = `|/${command} ${data.join(', ')}`;
		this._ws.send(cmd, (error) => {
			if(error) console.log(error);
		});
	}

	public async saveReplay(battleId: string) {
		const cmd = `${battleId}|/savereplay`;
		this._ws.send(cmd, (error) => {
			if(error) console.log(error);
		});
	}

	public async requestReplay(data:any) {
		const url = ClientURLs.LoginUrl.replace('<>', this._settings.server);
		data.id = `${this._settings.server === "showdown" ? "" : `${this._settings.server}-`}${data.id}`;

		let newData = stringify({
			act: "uploadreplay",
			log: data.log,
			id: data.id,
			//@ts-ignore
			headers: { "User-Agent": "MeloettaBot" as string},
		});

		let response = await axios.post(url, newData).catch((error) => console.error(error));

		let replay = `https://replay.pokemonshowdown.com/${data.id}`;
		return replay;
	}

	public async joinBattle(battleId: string, listener: (battle: ShowdownBattle) => void) {
		const cmd = `|/join ${battleId}`;

		this._ws.send(cmd, (error) => {
			if(error) throw error;
			const battle = new ShowdownBattle(battleId);
			listener(battle);
			this._ws.on('message', (rawdata) => {
				const data = rawdata.toString();
				const lines = data.split('\n');
				for(const line of lines) {
					if(line.startsWith('|')) {
						const sections = line.split('|');
						sections.shift();
						const command = sections.shift();

						battle.addLine(command as string, sections);
					}
				}
			});
		});
	}

	private async processCommand(data: string) {
		const sections = data.split('|');
		sections.shift();
		const topic = sections.shift()?.toLowerCase();
		switch(topic) {
			case 'queryresponse':
				this._client.emit('queryresponse', data);
				break;
			case 'challstr':
				const nonce = sections.join('|');

				const client = await this.login(nonce);

				const {assertion, actionsuccess, curuser} = client;

				if(!actionsuccess) {
					throw new Error(`Could not connect to server ${this._settings.server} with username: ${this._settings.credentials.username}`);
				} else if(assertion) {
					this._ws.send(`|/trn ${this._settings.credentials.username},0,${assertion}|`, (error) => {
						if(error) throw error;
					});

					await ReadyAction(this._client, client);
				}
			break;
		}
	}

	public async disconnect() {
		this._ws.close(1000, `Disconnected from server ${this._settings.server}`);
	}
}