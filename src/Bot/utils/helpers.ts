import { cache, client } from "../constants/instances";
import { IBotCommand } from "../interfaces/IBotCommand";
import { IBotEvent } from "../interfaces/IBotEvent";
import { IBotMonitor } from './../interfaces/IBotMonitor';

export function createBotCommand(command: IBotCommand) {
	if(cache.commands.has(command.name)) return;

	cache.commands.set(command.name, command);

	console.log(`Created Command ${command.name}`);
}

export function createBotEvent(event: IBotEvent) {
	if(cache.events.has(event.name)) return;

	cache.events.set(event.name, event);

	if(event.once) client.once(event.name, async (...args) => await event.invoke(...args));
	else client.on(event.name, async (...args) => await event.invoke(...args));

	console.log(`Created Event ${event.name}`);
}

export function createBotMonitor(monitor: IBotMonitor) {
	if(cache.monitors.has(monitor.name)) return;

	cache.monitors.set(monitor.name, monitor);

	console.log(`Created Monitor ${monitor.name}`);
}