import { EventEmitter } from "stream";
import { ShowdownClientUser } from "./ShowdownClientUser";
import { ShowdownSettings } from "./types/ShowdownSettings";
import { WebSocketManager } from "./ws/WebSocketManager";

export interface ShowdownEvents {
	ready: () => void;
	connected: () => void;
	disconnected: (code: number, reason: string) => void;
	error: (err: Error) => void;
	debug: (data: string) => void;
	noinit: (sections: string[]) => void;
	init: (sections: string[]) => void;
	updateUser: (sections: string[]) => void;
	message: (message: any) => void;
	updatechallenges: (sections: string[]) => void;
	updatesearch: (sections: string[]) => void;
	queryresponse: (data: any) => void;
}

export interface ShowdownClient {
	on<Event extends keyof ShowdownEvents>(event: Event, listener: ShowdownEvents[Event]): this;
	off<Event extends keyof ShowdownEvents>(event: Event, listener: ShowdownEvents[Event]): this;
	emit<Event extends keyof ShowdownEvents>(event: Event, ...args: Parameters<ShowdownEvents[Event]>): boolean;
	ws: WebSocketManager;
	user: ShowdownClientUser;
}

export class ShowdownClient extends EventEmitter{
	constructor(settings: ShowdownSettings) {
		super();
		this.ws = new WebSocketManager(this, settings);
	}

	public async connect() {
		try {
			await this.ws.connect();
		} catch (error) {
			throw error;
		}
	}
}