import type * as gql from "../../ts/interfaces/i.global";

export interface StaticPost {
	raw: gql.GraphQLPostNode;
	id: string;
	slug: string;
	title: string;
	date: string;
	content: string;
	author: gql.Author;
	categories: gql.Category[];
	url: string;
	hash: string;
	generatedAt: string;
}

export interface BlogManifest {
	generatedAt: string;
	endpoint: string;
	count: number;
	posts: StaticPost[];
}

export interface BlogDiff {
	added: StaticPost[];
	updated: StaticPost[];
	removed: StaticPost[];
	unchanged: StaticPost[];
}

export interface BlogGenerationResult {
	manifest: BlogManifest;
	diff: BlogDiff;
	writtenFiles: string[];
}