export interface ServiceRequest {
	id: string;
	name: string;
	email: string;
	company?: string;
	serviceType: string;
	budget: string;
	timeframe: string;
	projectDetails: string;
	status: "new" | "in-progress" | "completed" | "cancelled";
	createdAt: Date;
}
