export type PostStatus =
	| 'DRAFT'
	| 'PUBLISHED'
	| 'ARCHIVED';

export type PostAuthor = {
	username: string;
	profile: {
		displayName: string;
		avatarUrl: string | null;
	} | null;
};

export type Post = {
	id: string;
	title: string | null;
	content: string;
	imageUrl: string | null;
	status: PostStatus;
	publishedAt: string | null;
	createdAt: string;
	updatedAt: string;
	author: PostAuthor;
};

export type PostsResponse = {
	success: boolean;
	data: {
		posts: Post[];
		pagination: {
			page: number;
			limit: number;
			total: number;
			totalPages: number;
			hasNextPage: boolean;
		};
	};
};
