import { Code, Database, Gauge, Lightbulb, Users, Zap, Cloud, ChartNoAxesCombined, Workflow } from "lucide-react";
export const services = [
	{
		id: "leadership",
		title: "Technical Leadership",
		description:
			"Leading development teams, conducting code reviews, and ensuring efficient collaboration with coding standards.",
		icon: Users,
		price: "$25/hour",
		features: [
			"Code review & mentoring",
			"Architecture planning",
			"Best practices implementation",
			"Team workflow optimization",
			"Technical documentation",
		],
	},
	{
		id: "python-dev",
		title: "Python Development",
		description:
			"Backend development, scripting, and automation using Python (Django, Flask, FastAPI) for scalable applications.",
		icon: Zap,
		price: "$25/hour",
		features: [
			"RESTful API Development",
			"Data Processing & ETL",
			"Database Integration (SQL/NoSQL)",
			"Task Automation",
			"Cloud Deployment (Azure/AWS)",
		],
	},
	{
		id: "azure-devops",
		title: "Azure DevOps Implementation",
		description:
			"End-to-end DevOps automation using Azure DevOps for CI/CD, infrastructure as code (IaC), and seamless deployments.",
		icon: Workflow,
		price: "$25/hour",
		features: [
			"Build & Release Pipelines (YAML/Classic)",
			"Infrastructure as Code (Terraform/ARM)",
			"Automated Testing Integration",
			"Git Repos & Branch Policies",
			"Monitoring & Logging",
		],
	},

	{
		id: "frontend",
		title: "Frontend Development",
		description:
			"Modern, high-performance web applications using React, Svelte and Angular with clean, maintainable code and best practices.",
		icon: Code,
		price: "$15/hour",
		features: [
			"Responsive design for all devices",
			"Cross-browser compatibility",
			"Performance optimization",
			"Accessibility compliance",
			"Modern UI frameworks",
		],
	},

	{
		id: "performance",
		title: "Performance Optimization",
		description:
			"Optimize websites to load faster using code splitting, lazy loading, caching strategies, and minimizing render-blocking resources.",
		icon: Gauge,
		price: "$10/hour",
		features: [
			"Core Web Vitals improvement",
			"Lighthouse score optimization",
			"Bundle size reduction",
			"Image optimization",
			"Server-side rendering",
		],
	},
	{
		id: "api",
		title: "API Integration",
		description:
			"Seamless integration of frontend applications with backend systems using RESTful APIs and Firebase.",
		icon: Database,
		price: "$10/hour",
		features: [
			"RESTful API integration",
			"GraphQL implementation",
			"Real-time data synchronization",
			"Authentication & authorization",
			"Error handling & retry logic",
		],
	},
	{
		id: "azure-cloud",
		title: "Microsoft Azure Cloud",
		description:
			"Design, deploy, and manage scalable cloud solutions on Microsoft Azure, including compute, storage, networking, and security.",
		icon: Cloud,
		price: "$30/hour",
		features: [
			"Azure Virtual Machines & App Services",
			"Blob Storage & Cosmos DB",
			"Azure Networking (VNet, Load Balancers)",
			"Identity & Access Management",
			"Cost optimization & monitoring",
		],
	},
	{
		id: "microsoft-fabric",
		title: "Microsoft Fabric Migration",
		description:
			"Implement and migrate to Microsoft Fabric for unified analytics, data engineering, and business intelligence.",
		icon: ChartNoAxesCombined,
		price: "$35/hour",
		features: [
			"Data Lake & Warehouse Setup",
			"Power BI Integration",
			"Real-time Data Pipelines",
			"Migration from Synapse/Other Platforms",
			"Performance Optimization",
		],
	},
];
