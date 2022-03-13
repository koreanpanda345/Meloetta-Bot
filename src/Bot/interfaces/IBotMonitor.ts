export interface IBotMonitor {
	name: string;
	disabled: boolean;
	invoke: (...args: any[]) => Promise<unknown>;
}