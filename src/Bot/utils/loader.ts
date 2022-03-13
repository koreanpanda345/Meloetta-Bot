import * as glob from "glob";
export async function loadFiles(dirs: string[]) {
	for(const dir of dirs) {
		const files = glob.sync(`./src/Bot/${dir}/**/*.*`).filter(f => f.endsWith(".js") || f.endsWith(".ts"));
		
		for(const file of files) {
			await import(`${file.replace('./src/Bot', '../')}`);
		}
	}
}