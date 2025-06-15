import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	Timestamp,
	updateDoc,
	where,
	type DocumentData,
	type QueryDocumentSnapshot,
} from "firebase/firestore";
import { BaseService } from "../core/base-service";
import { Contact, ContactForm } from "./types";

export class ContactService extends BaseService {
	private readonly collectionName = "contacts";
	private readonly pageSize = 10;

	private convertToContact(doc: QueryDocumentSnapshot<DocumentData>): Contact {
		const data = doc.data();
		return {
			id: doc.id,
			name: data.name || "",
			email: data.email || "",
			subject: data.subject || "",
			message: data.message || "",
			status: data.status || "new",
			createdAt: this.convertTimestampToDate(data.createdAt) || new Date(),
		};
	}

	async getContacts(
		page = 1,
		startAfterDoc: QueryDocumentSnapshot<DocumentData> | null = null,
		status?: string,
	) {
		try {
			let contactsQuery = query(
				collection(this.db, this.collectionName),
				orderBy("createdAt", "desc"),
			);

			if (status && status !== "all") {
				contactsQuery = query(contactsQuery, where("status", "==", status));
			}

			if (startAfterDoc && page > 1) {
				contactsQuery = query(contactsQuery, startAfter(startAfterDoc), limit(this.pageSize));
			} else {
				contactsQuery = query(contactsQuery, limit(this.pageSize));
			}

			const snapshot = await getDocs(contactsQuery);
			const lastVisible = snapshot.docs[snapshot.docs.length - 1];

			// Check if there are more results
			let hasMore = false;
			if (lastVisible) {
				const nextQuery = query(
					collection(this.db, this.collectionName),
					orderBy("createdAt", "desc"),
					startAfter(lastVisible),
					limit(1),
				);
				const nextSnapshot = await getDocs(nextQuery);
				hasMore = !nextSnapshot.empty;
			}

			const contacts = snapshot.docs.map(this.convertToContact.bind(this)) as Contact[];

			return {
				contacts,
				lastVisible,
				hasMore,
			};
		} catch (error) {
			this.handleError(error, "fetching contacts");
		}
	}

	async getById(id: string): Promise<Contact | null> {
		try {
			const docRef = doc(this.db, this.collectionName, id);
			const docSnap = await getDoc(docRef);

			if (!docSnap.exists()) return null;
			return this.convertToContact(docSnap);
		} catch (error) {
			this.handleError(error, "fetching contact by id");
		}
	}

	async updateStatus(id: string, status: Contact["status"]): Promise<void> {
		try {
			const contactRef = doc(this.db, this.collectionName, id);
			await updateDoc(contactRef, {
				status,
				updatedAt: Timestamp.now(),
			});
		} catch (error) {
			this.handleError(error, "updating contact status");
		}
	}

	async submit(formData: ContactForm): Promise<string> {
		try {
			const docRef = await addDoc(collection(this.db, this.collectionName), {
				...formData,
				createdAt: Timestamp.now(),
				status: "new",
			});

			return docRef.id;
		} catch (error) {
			console.error("Error submitting contact form:", error);
			throw error; // Re-throw the error instead of handling it silently
		}
	}
}
