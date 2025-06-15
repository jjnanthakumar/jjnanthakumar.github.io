
import {
	Code2,
	LayoutGrid,
	PenTool,
	Smartphone,
	ShoppingCart,
	RefreshCw,
	Globe,
	Rocket,
	Search,
	ServerCog,
	Zap,
} from "lucide-react";
import { TOffer } from "@/types/offers";

export const offers: TOffer[] = [
	{
		id: "landing-page",
		title: "Landing Page Express",
		description: "Convert visitors into customers with a high-converting landing page",
		icon: LayoutGrid,
		price: 3000000,
		forWho: "Small businesses, startups, or individuals looking to promote a specific product or service",
		extras: [
			"Responsive design for all devices",
			"SEO optimization",
			"Contact form integration",
			"2 rounds of revisions",
			"Delivery in 7-10 days"
		],
		popular: true,
		color: "blue"
	},
	{
		id: "website",
		title: "Professional Website",
		description: "Full website development with multiple pages and custom features",
		icon: Globe,
		price: 8000000,
		forWho: "Established businesses that need a complete web presence with multiple sections",
		extras: [
			"Up to 5 pages (Home, About, Services, Portfolio, Contact)",
			"Responsive design for all devices",
			"SEO optimization",
			"Contact form & Google Maps integration",
			"Basic CMS implementation",
			"3 rounds of revisions",
			"Delivery in 3-4 weeks"
		],
		color: "indigo"
	},
	{
		id: "ecommerce",
		title: "E-Commerce Solution",
		description: "Sell your products online with a custom e-commerce website",
		icon: ShoppingCart,
		price: 15000000,
		forWho: "Retailers and product-based businesses looking to sell online",
		extras: [
			"Product catalog with categories",
			"Shopping cart & checkout functionality",
			"Payment gateway integration",
			"Inventory management",
			"Order tracking system",
			"Mobile responsive design",
			"Delivery in 5-6 weeks"
		],
		color: "violet"
	},
	{
		id: "code-review",
		title: "Frontend Code Review",
		description: "Expert evaluation of your frontend codebase with actionable improvements",
		icon: Code2,
		price: 1500000,
		forWho: "Development teams seeking to improve code quality and best practices",
		extras: [
			"Comprehensive code quality assessment",
			"Performance optimization suggestions",
			"Security vulnerability checks",
			"Best practices implementation guidance",
			"Documentation recommendations",
			"Delivery in 3-5 days"
		],
		color: "emerald"
	},
	{
		id: "redesign",
		title: "Website Redesign",
		description: "Breathe new life into your outdated website with a modern refresh",
		icon: RefreshCw,
		price: 5000000,
		forWho: "Businesses with existing websites that need a visual and functional upgrade",
		extras: [
			"Modern UI/UX redesign",
			"Performance optimization",
			"Mobile responsiveness improvements",
			"SEO enhancements",
			"Content restructuring",
			"Delivery in 2-3 weeks"
		],
		color: "purple"
	},
	{
		id: "seo",
		title: "SEO Website Audit",
		description: "Comprehensive analysis of your website's SEO with actionable improvements",
		icon: Search,
		price: 2000000,
		forWho: "Website owners looking to improve search engine rankings and visibility",
		extras: [
			"Keyword analysis & recommendations",
			"On-page SEO assessment",
			"Technical SEO audit",
			"Competitor analysis",
			"Content optimization suggestions",
			"Detailed report with action items",
			"Delivery in 1-2 weeks"
		],
		color: "yellow"
	},
	{
		id: "webapp",
		title: "Custom Web Application",
		description: "Tailored web application development to solve your specific business needs",
		icon: ServerCog,
		price: 20000000,
		forWho: "Businesses requiring specialized functionality beyond a standard website",
		extras: [
			"Custom functionality development",
			"User authentication system",
			"Database integration",
			"API development",
			"Admin dashboard",
			"Documentation and training",
			"Delivery in 8-12 weeks"
		],
		color: "sky"
	},
	{
		id: "mobile-responsive",
		title: "Mobile Responsiveness",
		description: "Make your existing website work flawlessly on all mobile devices",
		icon: Smartphone,
		price: 2500000,
		forWho: "Website owners whose sites don't perform well on mobile and tablet devices",
		extras: [
			"Full mobile responsiveness implementation",
			"Touch-friendly navigation",
			"Performance optimization for mobile",
			"Testing across multiple devices",
			"Delivery in 1-2 weeks"
		],
		color: "teal"
	},
	{
		id: "express-dev",
		title: "Express Development",
		description: "Rapid development for time-sensitive projects with quick turnaround",
		icon: Zap,
		price: 10000000,
		forWho: "Clients with urgent website or application needs and tight deadlines",
		extras: [
			"Expedited development process",
			"Daily progress updates",
			"Priority support",
			"Focused feature implementation",
			"Delivery in 1-2 weeks (project dependent)"
		],
		popular: true,
		color: "rose"
	}
];
