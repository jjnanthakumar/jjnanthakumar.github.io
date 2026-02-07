import type { LeadScoreBreakdown } from "@/types/lead-scoring";

export interface ServiceRequest {
	id: string;
	name: string;
	email: string;
	company?: string;
	serviceType: string;
	budget: string;
	timeframe: string;
	projectDetails: string;
	websiteUrl?: string;
	status: "new" | "in-progress" | "completed" | "cancelled";
	createdAt: Date;
	leadScore: number;
	priority: "hot" | "warm" | "cold";
	scoreBreakdown: LeadScoreBreakdown;
	recommendations: string[];
}
