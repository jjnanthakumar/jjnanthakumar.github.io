export type TCtaPage = "home" | "services" | "hire-me" | "about" | "blog" | "projects" | "default";

type TCtaData = {
	title: string;
	description: string;
	primaryButtonText: string;
	primaryButtonLink: string;
	primaryButtonScrollTo?: string;
	secondaryButtonText: string;
	secondaryButtonLink: string;
	badge: string;
	responseTime?: string;
};

const ctaMap: Record<TCtaPage, TCtaData> = {
	home: {
		title: "Turn your ideas into reality with just one click",
		description:
			"From concept to launch, I'm here to build solutions that make a difference. Ready to start something great?",
		primaryButtonText: "Let's Get Started",
		primaryButtonLink: "/hire-me",
		secondaryButtonText: "See My Work",
		secondaryButtonLink: "/projects",
		badge: "🚀 Let's kickstart your next big thing",
		// responseTime: "Replies in a few hours",
	},
	services: {
		title: "Custom web solutions tailored to your needs",
		description:
			"Whether it's a sleek website, a powerful dashboard, or API integration—I'll craft it with care and precision.",
		primaryButtonText: "Request a Service",
		primaryButtonLink: "/hire-me",
		primaryButtonScrollTo: "request-service-form",
		secondaryButtonText: "Free Consultation",
		secondaryButtonLink: "/book-consultation",
		badge: "🛠️ Offering solutions that work",
		responseTime: "Within 1 business day",
	},
	"hire-me": {
		title: "Ready to make your project a success?",
		description:
			"I bring ideas to life with clean code, modern design, and a focus on performance. Let's talk about how I can help you.",
		primaryButtonText: "Send a Proposal",
		primaryButtonLink: "/contact",
		primaryButtonScrollTo: "contact-form",
		secondaryButtonText: "Let's Discuss First",
		secondaryButtonLink: "/book-consultation",
		badge: "🤝 Let's collaborate",
		responseTime: "Often within hours",
	},
	about: {
		title: "From developer to problem-solver: my journey",
		description:
			"I've helped startups and businesses grow through thoughtful digital products. Want to work with someone experienced and easy to talk to?",
		primaryButtonText: "Work With Me",
		primaryButtonLink: "/hire-me",
		secondaryButtonText: "See My Work",
		secondaryButtonLink: "/projects",
		badge: "👋 Let's get to know each other",
		// responseTime: "Fast and friendly",
	},
	blog: {
		title: "Inspired by what you read?",
		description:
			"If my writing resonates with you, imagine what we could build together. Let's start a conversation.",
		primaryButtonText: "Get In Touch",
		primaryButtonLink: "/hire-me",
		secondaryButtonText: "Read More Posts",
		secondaryButtonLink: "/blog",
		badge: "📚 Curious minds connect",
		responseTime: "Usually same day",
	},
	projects: {
		title: "Want results like these for your business?",
		description: "You've seen what I can build. Now let's create something even better together.",
		primaryButtonText: "Start Your Project",
		primaryButtonLink: "/hire-me",
		secondaryButtonText: "Explore Services",
		secondaryButtonLink: "/services",
		badge: "💼 Let's build your next success",
		responseTime: "Within 24 hours",
	},
	default: {
		title: "Let's build something extraordinary together",
		description:
			"Need help with your next project or want to consult first? I'm ready when you are.",
		primaryButtonText: "Contact Me",
		primaryButtonLink: "/contact",
		secondaryButtonText: "See My Work",
		secondaryButtonLink: "/projects",
		badge: "✨ Let's make it happen",
		responseTime: "Quick to respond",
	},
};

export const getCtaDataForPage = (page: string): TCtaData => {
	return ctaMap[page as TCtaPage] ?? ctaMap["default"];
};
