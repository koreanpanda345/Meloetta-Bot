import { ShowdownClient } from "../../Client/ShowdownClient";
import { ShowdownClientUser } from "../../Client/ShowdownClientUser";

export default async function (client: ShowdownClient, data: any) {
	client.user = new ShowdownClientUser(data);
	client.emit('ready');
}