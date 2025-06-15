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
import { ServiceRequest } from "./types";

export type NewServiceRequest = Omit<ServiceRequest, "id" | "status" | "createdAt">;

export class ServiceRequestService extends BaseService {
	private readonly collectionName = "serviceRequests";
	private readonly pageSize = 10;

	private convertToServiceRequest(doc: QueryDocumentSnapshot<DocumentData>): ServiceRequest {
		const data = doc.data();
		return {
			id: doc.id,
			name: data.name || "",
			email: data.email || "",
			company: data.company || "",
			serviceType: data.serviceType || "",
			budget: data.budget || "",
			timeframe: data.timeframe || "",
			projectDetails: data.projectDetails || "",
			status: data.status || "new",
			createdAt: this.convertTimestampToDate(data.createdAt) || new Date(),
		};
	}

	async getRequests(
		page = 1,
		startAfterDoc: QueryDocumentSnapshot<DocumentData> | null = null,
		status?: string,
	) {
		try {
			let requestsQuery = query(
				collection(this.db, this.collectionName),
				orderBy("createdAt", "desc"),
			);

			if (status && status !== "all") {
				requestsQuery = query(requestsQuery, where("status", "==", status));
			}

			if (startAfterDoc && page > 1) {
				requestsQuery = query(requestsQuery, startAfter(startAfterDoc), limit(this.pageSize));
			} else {
				requestsQuery = query(requestsQuery, limit(this.pageSize));
			}

			const snapshot = await getDocs(requestsQuery);
			const lastVisible = snapshot.docs[snapshot.docs.length - 1];

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

			const requests = snapshot.docs.map(
				this.convertToServiceRequest.bind(this),
			) as ServiceRequest[];

			return {
				requests,
				lastVisible,
				hasMore,
			};
		} catch (error) {
			this.handleError(error, "fetching service requests");
		}
	}

	async getById(id: string): Promise<ServiceRequest | null> {
		try {
			const docRef = doc(this.db, this.collectionName, id);
			const docSnap = await getDoc(docRef);

			if (!docSnap.exists()) return null;
			return this.convertToServiceRequest(docSnap);
		} catch (error) {
			this.handleError(error, "fetching service request by id");
		}
	}

	async submit(data: NewServiceRequest): Promise<string> {
		try {
			const docRef = await addDoc(collection(this.db, this.collectionName), {
				...data,
				status: "new",
				createdAt: Timestamp.now(),
			});

			return docRef.id;
		} catch (error) {
			this.handleError(error, "submitting service request");
		}
	}

	async updateStatus(id: string, status: ServiceRequest["status"]): Promise<void> {
		try {
			const requestRef = doc(this.db, this.collectionName, id);
			await updateDoc(requestRef, {
				status,
				updatedAt: Timestamp.now(),
			});
		} catch (error) {
			this.handleError(error, "updating service request status");
		}
	}
}

// Export a singleton instance
export const serviceRequestService = new ServiceRequestService();
