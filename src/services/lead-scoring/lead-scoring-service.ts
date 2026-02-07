import type {
	LeadScore,
	LeadScoreBreakdown,
	LeadScoringCriteria,
} from "@/types/lead-scoring";

export class LeadScoringService {
	calculateScore(criteria: LeadScoringCriteria): LeadScore {
		const breakdown: LeadScoreBreakdown = {
			emailScore: this.scoreEmail(criteria.email, criteria.companyName),
			budgetScore: this.scoreBudget(criteria.budget),
			projectScore: this.scoreProjectType(criteria.projectType),
			timelineScore: this.scoreTimeline(criteria.timeline),
			engagementScore: this.scoreEngagement(criteria.message, criteria.websiteUrl),
		};

		const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0);
		const priority = this.determinePriority(totalScore);
		const recommendations = this.generateRecommendations(totalScore, breakdown);

		return {
			totalScore,
			priority,
			breakdown,
			recommendations,
		};
	}

	private scoreEmail(email: string, companyName?: string): number {
		let score = 0;

		// Corporate email domains
		const corporateDomains = ["company.com", "corp.com", "inc.com", "enterprise"];
		const freeDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];

		const domain = email.split("@")[1]?.toLowerCase();

		if (corporateDomains.some((d) => domain?.includes(d))) {
			score += 25; // Corporate email - high value
		} else if (domain && !freeDomains.includes(domain)) {
			score += 20; // Custom domain (likely business)
		} else {
			score += 5; // Free email (personal/freelancer)
		}

		// Has company name mentioned
		if (companyName && companyName.length > 2) {
			score += 10;
		}

		return score;
	}

	private scoreBudget(budget?: string): number {
		if (!budget) return 0;

		const budgetRanges: Record<string, number> = {
			"under-1000": 5,
			"1000-3000": 15,
			"3000-5000": 25,
			"5000-10000": 35,
			"above-10000": 40,
		};

		return budgetRanges[budget] || 0;
	}

	private scoreProjectType(projectType: string): number {
		let score = 0;

		// High-value project types
		const highValueProjects = [
			"full-stack",
			"devops",
			"cloud",
			"enterprise",
			"backend",
			"api",
		];

		const mediumValueProjects = ["frontend", "website", "mobile"];

		const lowercaseType = projectType.toLowerCase();

		if (highValueProjects.some((type) => lowercaseType.includes(type))) {
			score += 20;
		} else if (mediumValueProjects.some((type) => lowercaseType.includes(type))) {
			score += 15;
		} else {
			score += 10;
		}

		return score;
	}

	private scoreTimeline(timeline?: string): number {
		if (!timeline) return 5;

		const timelineScores: Record<string, number> = {
			asap: 20, // ASAP
			"1-2-weeks": 15, // Near future
			"1-month": 10, // Planning ahead
			flexible: 5, // Long-term planning
		};

		return timelineScores[timeline] || 5;
	}

	private scoreEngagement(message: string, websiteUrl?: string): number {
		let score = 0;

		// Message length (detailed = more serious)
		if (message.length > 200) score += 10;
		else if (message.length > 100) score += 5;
		else if (message.length < 50) score -= 5; // Penalty for very short

		// Has website URL (shows they're established)
		if (websiteUrl && websiteUrl.length > 10) {
			score += 10;
		}

		// Specific technical terms mentioned (shows clarity)
		const technicalTerms = [
			"api",
			"database",
			"aws",
			"azure",
			"ci/cd",
			"docker",
			"kubernetes",
			"terraform",
			"pipeline",
			"react",
			"python",
			"node",
		];
		const lowerMessage = message.toLowerCase();
		const termsFound = technicalTerms.filter((term) => lowerMessage.includes(term)).length;
		score += Math.min(termsFound * 3, 15);

		// Questions about process/timeline (serious buyer)
		if (lowerMessage.includes("process") || lowerMessage.includes("how long")) {
			score += 5;
		}

		return Math.min(Math.max(score, 0), 25); // Cap at 25, minimum 0
	}

	private determinePriority(score: number): "hot" | "warm" | "cold" {
		if (score >= 70) return "hot"; // Respond immediately
		if (score >= 40) return "warm"; // Respond same day
		return "cold"; // Standard response
	}

	private generateRecommendations(
		totalScore: number,
		breakdown: LeadScoreBreakdown,
	): string[] {
		const recommendations: string[] = [];

		if (totalScore >= 70) {
			recommendations.push("🔥 HIGH PRIORITY: Respond within 1 hour");
			recommendations.push("Prepare detailed proposal with case studies");
			recommendations.push("Offer video call consultation");
		} else if (totalScore >= 40) {
			recommendations.push("⚡ MODERATE PRIORITY: Respond within 4 hours");
			recommendations.push("Send service overview and portfolio");
		} else {
			recommendations.push("📧 STANDARD: Respond within 24 hours");
			recommendations.push("Send automated intro email");
		}

		if (breakdown.budgetScore === 0) {
			recommendations.push("💰 Ask about budget range in response");
		}

		if (breakdown.emailScore <= 10) {
			recommendations.push("⚠️ Personal email - Verify business legitimacy");
		}

		if (breakdown.engagementScore < 10) {
			recommendations.push("📝 Request more project details");
		}

		return recommendations;
	}
}

export const leadScoringService = new LeadScoringService();
