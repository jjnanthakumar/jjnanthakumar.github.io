import {
	addDoc,
	collection,
	doc,
	DocumentData,
	getDoc,
	getDocs,
	increment,
	limit,
	orderBy,
	query,
	QueryDocumentSnapshot,
	startAfter,
	Timestamp,
	updateDoc,
	where,
} from "firebase/firestore";
import { BaseService } from "../core/base-service";
import { NewProject, Project, TProjectResponse, UpdateProject } from "./types";

export class ProjectService extends BaseService {
	private readonly collectionName = "projects";
	private readonly pageSize = 9;

	private convertToProject(doc: QueryDocumentSnapshot<DocumentData>): TProjectResponse {
		const data = doc.data();
		return {
			id: doc.id,
			title: data.title,
			slug: data.slug,
			summary: data.summary,
			description: data.description,
			image: data.image,
			isPublished: data.isPublished,
			isFeatured: data.isFeatured,
			publishedDate: this.convertToDate(data, "publishedDate"),
			createdAt: this.setDefaultDate(this.convertToDate(data, "createdAt")),
			updatedAt: this.setDefaultDate(this.convertToDate(data, "updatedAt")),
			technologies: data.technologies || [],
			demoUrl: data.demoUrl,
			repoUrl: data.repoUrl,
			views: data.views || 0,
			likes: data.likes || 0,
			readingTime: data.readingTime || 0,
			authorId: data.authorId,
			authorName: data.authorName,
		};
	}

	async getAll(): Promise<Project[]> {
		try {
			const projectsRef = collection(this.db, this.collectionName);
			const q = query(
				projectsRef,
				where("isPublished", "==", true),
				orderBy("publishedDate", "desc"),
			);
			const snapshot = await getDocs(q);
			return snapshot.docs.map(this.convertToProject.bind(this));
		} catch (error) {
			this.handleError(error, "fetching projects");
		}
	}

	async getPaginated(lastVisible?: QueryDocumentSnapshot<DocumentData>) {
		try {
			const projectsRef = collection(this.db, this.collectionName);
			let q = query(
				projectsRef,
				where("isPublished", "==", true),
				orderBy("publishedDate", "desc"),
				limit(this.pageSize),
			);

			if (lastVisible) {
				q = query(q, startAfter(lastVisible));
			}

			const snapshot = await getDocs(q);
			const projects = snapshot.docs.map(this.convertToProject.bind(this));
			const lastDoc = snapshot.docs[snapshot.docs.length - 1];

			return {
				projects,
				lastDoc,
				hasMore: snapshot.docs.length === this.pageSize,
			};
		} catch (error) {
			this.handleError(error, "fetching paginated projects");
		}
	}

	async getFeatured(count: number = 3): Promise<Project[]> {
		try {
			const projectsRef = collection(this.db, this.collectionName);
			const q = query(
				projectsRef,
				where("isPublished", "==", true),
				orderBy("views", "desc"),
				limit(count),
			);
			const snapshot = await getDocs(q);
			return snapshot.docs.map(this.convertToProject.bind(this));
		} catch (error) {
			this.handleError(error, "fetching featured projects");
		}
	}

	async getLatest(count: number = 3): Promise<Project[]> {
		try {
			const projectsRef = collection(this.db, this.collectionName);
			const q = query(
				projectsRef,
				where("isPublished", "==", true),
				orderBy("publishedDate", "desc"),
				limit(count),
			);
			const snapshot = await getDocs(q);
			return snapshot.docs.map(this.convertToProject.bind(this));
		} catch (error) {
			this.handleError(error, "fetching latest projects");
		}
	}

	async getBySlug(slug: string): Promise<TProjectResponse | null> {
		try {
			const projectsRef = collection(this.db, this.collectionName);
			const q = query(
				projectsRef,
				where("slug", "==", slug),
				where("isPublished", "==", true),
				limit(1),
			);
			const snapshot = await getDocs(q);
			if (snapshot.empty) return null;
			return this.convertToProject(snapshot.docs[0]);
		} catch (error) {
			this.handleError(error, "fetching project by slug");
		}
	}

	async getById(id: string): Promise<TProjectResponse | null> {
		try {
			const docRef = doc(this.db, this.collectionName, id);
			const docSnap = await getDoc(docRef);
			if (!docSnap.exists()) return null;
			return this.convertToProject(docSnap);
		} catch (error) {
			this.handleError(error, "fetching project by id");
		}
	}

	async getByAuthor(authorId: string): Promise<Project[]> {
		try {
			const projectsRef = collection(this.db, this.collectionName);
			const q = query(projectsRef, where("authorId", "==", authorId), orderBy("createdAt", "desc"));
			const snapshot = await getDocs(q);
			return snapshot.docs.map(this.convertToProject.bind(this));
		} catch (error) {
			this.handleError(error, "fetching projects by author");
		}
	}

	async incrementView(id: string): Promise<void> {
		try {
			const projectRef = doc(this.db, this.collectionName, id);
			await updateDoc(projectRef, { views: increment(1) });
		} catch (error) {
			this.handleError(error, "incrementing project view");
		}
	}

	async incrementLike(id: string): Promise<void> {
		try {
			const projectRef = doc(this.db, this.collectionName, id);
			await updateDoc(projectRef, { likes: increment(1) });
		} catch (error) {
			this.handleError(error, "incrementing project like");
		}
	}

	async create(project: NewProject): Promise<string> {
		try {
			const now = Timestamp.now();
			const projectData = {
				...project,
				views: 0,
				likes: 0,
				createdAt: now,
				updatedAt: now,
				publishedDate: project.isPublished ? now : null,
			};
			const docRef = await addDoc(collection(this.db, this.collectionName), projectData);
			return docRef.id;
		} catch (error) {
			this.handleError(error, "creating project");
		}
	}

	async update(id: string, project: UpdateProject): Promise<void> {
		try {
			const projectRef = doc(this.db, this.collectionName, id);
			const now = Timestamp.now();
			const updateData = {
				...project,
				updatedAt: now,
				...(project.isPublished && !project.publishedDate ? { publishedDate: now } : {}),
			};
			await updateDoc(projectRef, updateData);
		} catch (error) {
			this.handleError(error, "updating project");
		}
	}

	async delete(id: string): Promise<void> {
		try {
			const projectRef = doc(this.db, this.collectionName, id);
			await updateDoc(projectRef, {
				isPublished: false,
				deletedAt: Timestamp.now(),
			});
		} catch (error) {
			this.handleError(error, "deleting project");
		}
	}

	async searchByTechnology(technology: string): Promise<Project[]> {
		try {
			const projectsRef = collection(this.db, this.collectionName);
			const q = query(
				projectsRef,
				where("isPublished", "==", true),
				where("technologies", "array-contains", technology),
				orderBy("publishedDate", "desc"),
			);
			const snapshot = await getDocs(q);
			return snapshot.docs.map(this.convertToProject.bind(this));
		} catch (error) {
			this.handleError(error, "searching projects by technology");
		}
	}

	async getFeaturedProjects(): Promise<Project[]> {
		try {
			const projectsRef = collection(this.db, this.collectionName);
			const q = query(
				projectsRef,
				where("isPublished", "==", true),
				where("isFeatured", "==", true),
				orderBy("publishedDate", "desc"),
			);
			const snapshot = await getDocs(q);
			return snapshot.docs.map(this.convertToProject.bind(this));
		} catch (error) {
			this.handleError(error, "fetching featured projects");
		}
	}

	async getByPage(
		page: number,
		pageSize: number,
		filters?: {
			searchTerm?: string;
			technology?: string;
		},
	): Promise<{ projects: Project[]; totalPages: number; currentPage: number }> {
		try {
			const projectsRef = collection(this.db, this.collectionName);
			let baseQuery = query(
				projectsRef,
				where("isPublished", "==", true),
				where("isFeatured", "==", false),
				orderBy("publishedDate", "desc"),
			);

			// Apply filters
			if (filters?.technology) {
				baseQuery = query(baseQuery, where("technologies", "array-contains", filters.technology));
			}

			// Note: Firestore doesn't support partial search (like LIKE in SQL)
			// If full-text search is needed, consider using Algolia or Firestore + custom indexing
			if (filters?.searchTerm) {
				// This line is unsafe and only works if searchTerm is an array
				// You might consider filtering this in-memory after fetching
				console.warn("searchTerm filtering is basic. Consider full-text search integration.");
			}

			// Fetch all filtered results (inefficient if too many docs)
			const allDocsSnapshot = await getDocs(baseQuery);
			const allDocs = allDocsSnapshot.docs;

			// Calculate total count for pagination
			const totalCount = allDocs.length;
			const totalPages = Math.ceil(totalCount / pageSize);

			// Apply in-memory pagination
			const paginatedDocs = allDocs.slice((page - 1) * pageSize, page * pageSize);

			const projects = paginatedDocs.map(this.convertToProject.bind(this));

			return {
				projects: projects as Project[],
				totalPages,
				currentPage: page,
			};
		} catch (error) {
			console.error("Error in getByPage:", error);
			this.handleError(error, "fetching projects by page");
		}
	}

	async getAllTechnologies(): Promise<string[]> {
		try {
			const projectsRef = collection(this.db, this.collectionName);
			const q = query(projectsRef, where("isPublished", "==", true));
			const snapshot = await getDocs(q);

			// Get all technologies and remove duplicates
			const techSet = new Set<string>();
			snapshot.docs.forEach((doc) => {
				const technologies = doc.data().technologies || [];
				technologies.forEach((tech) => techSet.add(tech));
			});

			return Array.from(techSet).sort();
		} catch (error) {
			this.handleError(error, "fetching all technologies");
		}
	}
}
