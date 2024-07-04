export interface TermSocketMessage {
	event: string;
	id: string;
	output: string;
}

 export interface FileTreeSocketMessage {
	name: string;
	path: string;
	isDir: boolean;
}

 export interface FileNode {
	name: string;
	children?: FileNode[];
}
