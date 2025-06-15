import { Timestamp } from "firebase/firestore";

export interface Blog {
	id: string;
	title: string;
	slug: string;
	summary: string;
	content: string;
	image: string;
	isPublished: boolean;
	publishedDate: Timestamp | null;
	createdAt: Timestamp;
	updatedAt: Timestamp;
	tags: string[];
	views: number;
	likes: number;
	readingTime: number;
	authorId: string;
	authorName: string;
}

export type NewBlog = Omit<Blog, "id" | "createdAt" | "updatedAt">;
export type UpdateBlog = Partial<Omit<Blog, "id" | "createdAt" | "updatedAt">>;
