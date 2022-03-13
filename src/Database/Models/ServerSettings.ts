import {Document, Schema, model} from "mongoose";

export interface IServerSettings extends Document{
	guild_id: string;
	prefix: string;
}

const schema = new Schema<IServerSettings>({
	guild_id: String,
	prefix: String,
});

export default model<IServerSettings>("Server Settings", schema);