import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
	where,
	DocumentData,
	QueryDocumentSnapshot,
} from "firebase/firestore";
import { BaseService } from "../core/base-service";
import { Certification, NewCertification, TCertificationResponse, UpdateCertification } from "./types";

export class CertificationService extends BaseService {
	private readonly collectionName = "certifications";

	private convertToCertification(doc: QueryDocumentSnapshot<DocumentData>): TCertificationResponse {
		const data = doc.data();
		return {
			id: doc.id,
			title: data.title,
			issuer: data.issuer,
			issuerLogo: data.issuerLogo,
			issueDate: this.convertToDate(data, "issueDate"),
			expiryDate: data.expiryDate ? this.convertToDate(data, "expiryDate") : undefined,
			credentialId: data.credentialId,
			credentialUrl: data.credentialUrl,
			thumbnailUrl: data.thumbnailUrl,
			description: data.description,
			skills: data.skills || [],
			isEnterprise: data.isEnterprise || false,
			isPublished: data.isPublished,
			order: data.order || 0,
			createdAt: this.setDefaultDate(this.convertToDate(data, "createdAt")),
			updatedAt: this.setDefaultDate(this.convertToDate(data, "updatedAt")),
		};
	}

	async getAll(): Promise<TCertificationResponse[]> {
		try {
			const certificationsRef = collection(this.db, this.collectionName);
			const q = query(
				certificationsRef,
				where("isPublished", "==", true),
				orderBy("order", "asc"),
				orderBy("issueDate", "desc"),
			);
			const snapshot = await getDocs(q);
			return snapshot.docs.map(this.convertToCertification.bind(this));
		} catch (error) {
			this.handleError(error, "fetching certifications");
		}
	}

	async getById(id: string): Promise<TCertificationResponse | null> {
		try {
			const docRef = doc(this.db, this.collectionName, id);
			const docSnap = await getDoc(docRef);

			if (!docSnap.exists()) {
				return null;
			}

			return this.convertToCertification(docSnap as QueryDocumentSnapshot<DocumentData>);
		} catch (error) {
			this.handleError(error, `fetching certification with id ${id}`);
		}
	}

	async getByIssuer(issuer: string): Promise<TCertificationResponse[]> {
		try {
			const certificationsRef = collection(this.db, this.collectionName);
			const q = query(
				certificationsRef,
				where("issuer", "==", issuer),
				where("isPublished", "==", true),
				orderBy("issueDate", "desc"),
			);
			const snapshot = await getDocs(q);
			return snapshot.docs.map(this.convertToCertification.bind(this));
		} catch (error) {
			this.handleError(error, `fetching certifications for issuer ${issuer}`);
		}
	}

	async getEnterpriseCertifications(): Promise<TCertificationResponse[]> {
		try {
			const certificationsRef = collection(this.db, this.collectionName);
			const q = query(
				certificationsRef,
				where("isEnterprise", "==", true),
				where("isPublished", "==", true),
				orderBy("issueDate", "desc"),
			);
			const snapshot = await getDocs(q);
			return snapshot.docs.map(this.convertToCertification.bind(this));
		} catch (error) {
			this.handleError(error, "fetching enterprise certifications");
		}
	}

	async getAllIssuers(): Promise<string[]> {
		try {
			const certifications = await this.getAll();
			const issuers = Array.from(new Set(certifications.map((cert) => cert.issuer)));
			return issuers.sort();
		} catch (error) {
			this.handleError(error, "fetching all issuers");
		}
	}

	// CMS/Admin operations
	async create(certification: NewCertification): Promise<string> {
		try {
			const certificationsRef = collection(this.db, this.collectionName);
			const docRef = await addDoc(certificationsRef, {
				...certification,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});
			return docRef.id;
		} catch (error) {
			this.handleError(error, "creating certification");
		}
	}

	async update(id: string, certification: UpdateCertification): Promise<void> {
		try {
			const docRef = doc(this.db, this.collectionName, id);
			await updateDoc(docRef, {
				...certification,
				updatedAt: serverTimestamp(),
			});
		} catch (error) {
			this.handleError(error, `updating certification with id ${id}`);
		}
	}

	async delete(id: string): Promise<void> {
		try {
			const docRef = doc(this.db, this.collectionName, id);
			await deleteDoc(docRef);
		} catch (error) {
			this.handleError(error, `deleting certification with id ${id}`);
		}
	}
}

export const certificationService = new CertificationService();
