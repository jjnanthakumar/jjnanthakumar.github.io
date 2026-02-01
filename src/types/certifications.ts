import { Timestamp } from "firebase/firestore";

export interface Certification {
	id: string;
	title: string;
	issuer: string;
	issuerLogo: string; // Logo URL for the issuing organization
	issueDate: Timestamp | null;
	expiryDate?: Timestamp | null;
	credentialId?: string;
	credentialUrl?: string;
	thumbnailUrl: string; // Badge image URL
	description: string;
	skills?: string[];
	isEnterprise?: boolean; // Flag for enterprise certifications (Microsoft, Google, AWS, GitHub, etc.)
	isPublished: boolean; // Control visibility
	order: number; // Display order
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

export type NewCertification = Omit<Certification, "id" | "createdAt" | "updatedAt">;
export type UpdateCertification = Partial<Omit<Certification, "id" | "createdAt" | "updatedAt">>;

export type TCertificationResponse = Omit<Certification, "createdAt" | "updatedAt" | "issueDate" | "expiryDate"> & {
	createdAt: Date;
	updatedAt: Date;
	issueDate: Date | null;
	expiryDate?: Date | null;
};
