export interface LeadScoringCriteria {
	email: string;
	budget?: string;
	projectType: string;
	timeline?: string;
	companyName?: string;
	websiteUrl?: string;
	message: string;
	urgency?: "low" | "medium" | "high";
}

export interface LeadScoreBreakdown {
	emailScore: number;
	budgetScore: number;
	projectScore: number;
	timelineScore: number;
	engagementScore: number;
}

export interface LeadScore {
	totalScore: number;
	priority: "hot" | "warm" | "cold";
	breakdown: LeadScoreBreakdown;
	recommendations: string[];
}

export interface EnrichedServiceRequest {
	id?: string;
	name: string;
	email: string;
	company?: string;
	serviceType: string;
	budget: string;
	timeframe: string;
	projectDetails: string;
	websiteUrl?: string;
	status: "new" | "in-progress" | "completed" | "cancelled";
	leadScore: number;
	priority: "hot" | "warm" | "cold";
	scoreBreakdown: LeadScoreBreakdown;
	recommendations: string[];
	createdAt: Date;
}
