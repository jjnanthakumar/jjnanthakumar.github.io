import { Timestamp } from "firebase/firestore";

export interface Project {
	id: string;
	title: string;
	slug: string;
	summary: string;
	description: string;
	image: string;
	isPublished: boolean;
	isFeatured: boolean;
	publishedDate: Timestamp | null;
	createdAt: Timestamp;
	updatedAt: Timestamp;
	technologies: string[];
	demoUrl?: string;
	repoUrl?: string;
	views: number;
	likes: number;
	readingTime: number;
	authorId?: string;
	authorName?: string;
}

export type NewProject = Omit<Project, "id" | "createdAt" | "updatedAt">;
export type UpdateProject = Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>;

export type TProjectResponse = Omit<Project, "createdAt" | "updatedAt" | "publishedDate"> & {
	createdAt: Date;
	updatedAt: Date;
	publishedDate: Date | null;
};
