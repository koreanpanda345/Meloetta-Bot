export interface IBotEvent {
	name: string;
	once?: boolean;
	disabled?: boolean;
	invoke: (...args: any[]) => Promise<void>;
}