import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	increment,
	limit,
	orderBy,
	query,
	QueryDocumentSnapshot,
	Timestamp,
	updateDoc,
	where,
} from "firebase/firestore";
import { BaseService } from "../core/base-service";
import { Blog, NewBlog, UpdateBlog } from "./types";

export class BlogService extends BaseService {
	private readonly collectionName = "blogs";

	async getByPage(
		page: number,
		pageSize: number,
	): Promise<{ blogs: Blog[]; totalPages: number; currentPage: number }> {
		try {
			const blogsRef = collection(this.db, this.collectionName);

			// First, get total count for pagination
			const countSnapshot = await getDocs(query(blogsRef, where("isPublished", "==", true)));
			const totalCount = countSnapshot.size;

			// Calculate the offset
			const offset = (page - 1) * pageSize;

			// Get all documents up to the offset + pageSize
			const q = query(
				blogsRef,
				where("isPublished", "==", true),
				orderBy("publishedDate", "desc"),
				limit(offset + pageSize),
			);

			const snapshot = await getDocs(q);

			// Slice the results to get only the current page
			const blogs = snapshot.docs.slice(offset).map(this.convertToBlog.bind(this));

			return {
				blogs: blogs as Blog[],
				totalPages: Math.ceil(totalCount / pageSize),
				currentPage: page,
			};
		} catch (error) {
			console.error("Error in getByPage:", error);
			this.handleError(error, "fetching blogs by page");
		}
	}

	private convertToBlog(doc: QueryDocumentSnapshot): Blog {
		const data = doc.data();
		return {
			id: doc.id,
			title: data.title,
			slug: data.slug,
			summary: data.summary,
			content: data.content,
			image: data.image,
			isPublished: data.isPublished,
			publishedDate: data.publishedDate || null,
			createdAt: data.createdAt || Timestamp.now(),
			updatedAt: data.updatedAt || Timestamp.now(),
			tags: data.tags || [],
			views: data.views || 0,
			likes: data.likes || 0,
			readingTime: data.readingTime || 0,
			authorId: data.authorId,
			authorName: data.authorName,
		} as Blog;
	}

	async getAll(): Promise<Blog[]> {
		try {
			const blogsRef = collection(this.db, this.collectionName);
			const q = query(blogsRef, orderBy("published", "desc"));
			const snapshot = await getDocs(q);
			return snapshot.docs.map(this.convertToBlog.bind(this));
		} catch (error) {
			this.handleError(error, "fetching blogs");
		}
	}

	async getLatest(count: number = 3): Promise<Blog[]> {
		try {
			const blogsRef = collection(this.db, this.collectionName);
			const q = query(
				blogsRef,
				where("isPublished", "==", true),
				orderBy("publishedDate", "desc"),
				limit(count),
			);
			const snapshot = await getDocs(q);
			return snapshot.docs.map(this.convertToBlog.bind(this));
		} catch (error) {
			this.handleError(error, "fetching latest blogs");
		}
	}

	async getBySlug(slug: string): Promise<Blog | null> {
		try {
			const blogsRef = collection(this.db, this.collectionName);
			const q = query(
				blogsRef,
				where("slug", "==", slug),
				where("isPublished", "==", true),
				limit(1),
			);
			const snapshot = await getDocs(q);
			if (snapshot.empty) return null;
			return this.convertToBlog(snapshot.docs[0]);
		} catch (error) {
			this.handleError(error, "fetching blog by slug");
		}
	}

	async getById(id: string): Promise<Blog | null> {
		try {
			const docRef = doc(this.db, this.collectionName, id);
			const docSnap = await getDoc(docRef);
			if (!docSnap.exists()) return null;
			return this.convertToBlog(docSnap);
		} catch (error) {
			this.handleError(error, "fetching blog by id");
		}
	}

	async incrementView(id: string): Promise<void> {
		try {
			const blogRef = doc(this.db, this.collectionName, id);
			await updateDoc(blogRef, { views: increment(1) });
		} catch (error) {
			this.handleError(error, "incrementing blog view");
		}
	}

	async incrementLike(id: string): Promise<void> {
		try {
			const blogRef = doc(this.db, this.collectionName, id);
			await updateDoc(blogRef, { likes: increment(1) });
		} catch (error) {
			this.handleError(error, "incrementing blog like");
		}
	}

	async create(blog: NewBlog): Promise<string> {
		try {
			const now = new Date();
			const blogData = {
				...blog,
				views: 0,
				likes: 0,
				createdAt: now,
				updatedAt: now,
				publishedDate: blog.isPublished ? now : null,
			};
			const docRef = await addDoc(collection(this.db, this.collectionName), blogData);
			return docRef.id;
		} catch (error) {
			this.handleError(error, "creating blog");
		}
	}

	async update(id: string, blog: UpdateBlog): Promise<void> {
		try {
			const blogRef = doc(this.db, this.collectionName, id);
			const updateData = {
				...blog,
				updatedAt: Timestamp.now(),
				...(blog.isPublished && !blog.publishedDate ? { publishedDate: new Date() } : {}),
			};
			await updateDoc(blogRef, updateData);
		} catch (error) {
			this.handleError(error, "updating blog");
		}
	}

	async getAllTags() {
		try {
			const blogsRef = collection(this.db, this.collectionName);
			const q = query(blogsRef, where("isPublished", "==", true));
			const snapshot = await getDocs(q);
			const tags = Array.from(new Set(snapshot.docs.map((doc) => doc.data().tags || []).flat()));
			return { tags };
		} catch (error) {
			this.handleError(error, "fetching all tags");
		}
	}
}
