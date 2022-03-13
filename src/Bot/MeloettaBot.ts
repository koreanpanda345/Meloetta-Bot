import { client } from "./constants/instances";
import { loadFiles } from "./utils/loader"

export default new class MeloettaBot {
	public async startBot() {
		await loadFiles(['events', 'monitors', 'commands']);

		client.login(process.env.DISCORD_BOT_TOKEN as string);
	}
}