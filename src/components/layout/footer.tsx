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

export const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-border/40 bg-gradient-to-b from-background to-muted/20 p-1">
			<div className="container px-2 md:px-0 py-2 mx-auto">
				<div className="border-t border-border/30 mt-2 pt-2 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
					<p>&copy; {currentYear} Nanthakumar. Based on open-source code licensed under the MIT License.</p>
					<p className="flex items-center">
						Made with <Heart size={14} className="mx-1 text-red-500" /> using React, Tailwind & Firebase
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
