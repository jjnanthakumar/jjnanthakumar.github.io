import { ArrowUpRight, Clock, Github, Heart, Linkedin, Mail, MapPin, Twitter } from "lucide-react";
import { Link } from "react-router";

const socialLinks = [
	{ href: "https://github.com/jjnanthakumar", icon: Github, label: "GitHub" },
	{ href: "https://x.com/jjnanthakumar", icon: Twitter, label: "Twitter" },
	{
		href: "https://linkedin.com/in/jjnanthakumar",
		icon: Linkedin,
		label: "LinkedIn",
	},
];

const navLinks = [
	{ to: "/", label: "Home" },
	{ to: "/blog", label: "Blog" },
	{ to: "/projects", label: "Projects" },
	{ to: "/services", label: "Services" },
	{ to: "/about", label: "About" },
	{ to: "/contact", label: "Contact" },
];

const projectLinks = [
	{ href: "https://sundflow.cloud", label: "SundFlow" },
	// Add more project links as needed
];

export const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-border/40 bg-gradient-to-b from-background to-muted/20">
			<div className="container px-4 md:px-0 py-16 mx-auto">
				<div className="border-t border-border/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
					<p>&copy; {currentYear} Nanthakumar. All rights reserved.</p>
					<p className="flex items-center">
						Made with <Heart size={14} className="mx-1 text-red-500" /> using React & Tailwind
					</p>
					<a
						className="hover:underline flex"
						href="https://github.com/jjnanthakumar"
						target="_blank"
						rel="noopener noreferrer"
					>
						See the recent update on Github
					</a>
				</div>
			</div>
		</footer>
	);
};
