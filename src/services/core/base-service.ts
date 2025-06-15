import { db } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { DocumentData, Timestamp } from "firebase/firestore";
import { ZodSchema } from "zod";

export class ServiceError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly originalError?: unknown,
	) {
		super(message);
		this.name = "ServiceError";
	}
}

export abstract class BaseService {
	protected db = db;

	protected handleError(error: unknown, customMessage: string): never {
		console.error(`${customMessage}:`, error);

		if (error instanceof FirebaseError) {
			throw new ServiceError(`${customMessage}: ${error.message}`, error.code, error);
		}

		throw new ServiceError(customMessage, undefined, error);
	}

	protected validateInput<T>(data: T, schema: ZodSchema<T>): T {
		try {
			return schema.parse(data);
		} catch (error) {
			this.handleError(error, "Validation failed");
		}
	}

	// Firebase utility methods
	protected convertTimestampToDate(timestamp: Timestamp | null | undefined): Date | null {
		return timestamp?.toDate() || null;
	}

	protected setDefaultDate(date: Date | null | undefined): Date {
		return date || new Date();
	}

	protected convertToDate(data: DocumentData, fieldName: string): Date | null {
		return data[fieldName]?.toDate() || null;
	}
}
