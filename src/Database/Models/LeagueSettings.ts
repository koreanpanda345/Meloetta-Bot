import {Document, Schema, model} from "mongoose";
export interface ILeagueSettings extends Document {
	league_name: string;
	guild_id: string;
	live_links: {
		channel_id: string;
		replay_channel: string;
	};
}

const schema = new Schema<ILeagueSettings>({
	league_name: String,
	guild_id: String,
	live_links: {
		channel_id: String,
		replay_channel: String
	}
});

export default model<ILeagueSettings>("League Settings", schema);