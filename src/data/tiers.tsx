import {
	Code,
	Database,
	Gauge,
	Lightbulb,
	Users,
	Zap,
	Cloud,
	ChartNoAxesCombined,
	Workflow,
} from "lucide-react";
// Service packages with pricing tiers
export const serviceTiers = [
	{
		id: "basic",
		name: "Basic",
		price: "$15/hour",
		description: "Perfect for small projects and quick tasks",
		features: [
			"Quick Implementation/POC",
			"Bug fixes and improvements",
			"Code review and optimization",
			"Up to 20 hours per week",
		],
		popular: false,
		cta: "Get Started",
	},
	{
		id: "professional",
		name: "Professional",
		price: "$499/week",
		description: "Ideal for medium-sized projects and ongoing development",
		features: [
			"Everything in Basic tier",
			"Full-stack implementation",
			"Performance optimization",
			"Regular progress updates",
			"Up to 40 hours per week",
			"Cloud Solutions - Consultancy",
		],
		popular: true,
		cta: "Most Popular",
	},
	{
		id: "enterprise",
		name: "Enterprise",
		price: "Custom",
		description: "For large-scale projects and dedicated development",
		features: [
			"Everything in Professional tier",
			"Technical leadership",
			"Architecture planning",
			"24/7 priority support",
			"DevOps Implementation",
			"Cloud Security",
		],
		popular: false,
		cta: "Contact for Quote",
	},
];

// Expertise areas
export const expertiseAreas = [
	{
		title: "Technical Leadership",
		description:
			"Leading development teams, conducting code reviews, and ensuring efficient collaboration with coding standards.",
		icon: Users,
		delay: "0.1s",
	},
	{
		id: "python-dev",
		title: "Python Development",
		description:
			"Backend development, scripting, and automation using Python (Django, Flask, FastAPI) for scalable applications.",
		icon: Zap,
		delay: "0.1s",
	},
	{
		id: "azure-devops",
		title: "Azure DevOps Implementation",
		description:
			"End-to-end DevOps automation using Azure DevOps for CI/CD, infrastructure as code (IaC), and seamless deployments.",
		icon: Workflow,
		delay: "0.1s",
	},
	{
		title: "Full-Stack Development",
		description:
			"Modern, high-performance web applications using React, Vue, and Angular with clean, maintainable code and best practices.",
		icon: Code,
		delay: "0.4s",
	},
	{
		id: "azure-cloud",
		title: "Microsoft Azure Cloud",
		description:
			"Design, deploy, and manage scalable cloud solutions on Microsoft Azure, including compute, storage, networking, and security.",
		icon: Cloud,
		delay: "0.4s",
	},
	{
		title: "API Integration",
		description:
			"Seamless integration of frontend applications with backend systems using RESTful APIs and Firebase.",
		icon: Database,
		delay: "0.4s",
	},
];
