import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { Menu, Moon, Sparkles, Sun, User, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

const navLinks = [
	{ title: "Home", path: "/" },
	{ title: "Projects", path: "/projects" },
	{ title: "Services", path: "/services" },
	{ title: "Open Source", path: "/open-source" },
	{ title: "About", path: "/about" },
	{ title: "Contact", path: "/contact" },
];

export const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const location = useLocation();
	const { theme, setTheme } = useTheme();
	const { user } = useAuth();

	// Handle scroll effect - improved for performance
	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			if (scrollTop > 10) {
				if (!isScrolled) setIsScrolled(true);
			} else {
				if (isScrolled) setIsScrolled(false);
			}
		};

		// Add passive listener for better performance
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isScrolled]);

	// Close mobile menu when changing routes
	useEffect(() => {
		setIsOpen(false);
	}, [location]);

	// Prevent scroll when mobile menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	const toggleMenu = () => setIsOpen(!isOpen);
	const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

	return (
		<header
			className={cn(
				"fixed top-0 w-full z-50 transition-all duration-300",
				isScrolled
					? "bg-background/80 backdrop-blur-md border-b border-border/20 shadow-sm py-3"
					: "bg-transparent py-5",
			)}
		>
			<div className="container px-4 md:px-0 mx-auto flex items-center justify-between">
				{/* Logo */}
				<Link
					to="/"
					className="text-xl font-bold tracking-tighter relative z-10 flex items-center group"
				>
					<div className="relative">
						<div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/40 dark:from-primary/50 dark:to-primary/90 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
						<div className="relative flex items-center">
							<span className="text-primary mr-1">&lt;</span>
							<span>NJ</span>
							<span className="text-primary ml-1">/&gt;</span>
							<i className="text-primary text-sm ml-2">Where Tech meets impact!</i>
						</div>
					</div>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
					{navLinks.map((link) => (
						<Link
							key={link.path}
							to={link.path}
							className={cn(
								"px-3 py-2 rounded-full text-sm font-medium transition-all hover:bg-primary/10",
								location.pathname === link.path
									? "text-primary bg-primary/10 font-semibold"
									: "text-foreground/80",
							)}
						>
							{link.title}
						</Link>
					))}

					<div className="ml-2 p-1 bg-background/50 border border-border/40 rounded-full flex items-center">
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleTheme}
							className="rounded-full h-8 w-8"
							aria-label="Toggle theme"
						>
							{theme === "dark" ? (
								<Sun size={16} className="text-yellow-500" />
							) : (
								<Moon size={16} className="text-slate-700" />
							)}
						</Button>
					</div>

					{user ? (
						<Button className="rounded-full px-6 ml-2 group" asChild>
							<Link to="/cms/dashboard">
								<User size={16} className="mr-1 group-hover:animate-pulse" />
								Dashboard
							</Link>
						</Button>
					) : (
						<Button className="rounded-full px-6 ml-2 group" asChild>
							<Link to="/hire-me">
								<Sparkles size={16} className="mr-1 animate-pulse" />
								Hire Me
							</Link>
						</Button>
					)}
				</nav>

				{/* Mobile Navigation */}
				<div className="md:hidden flex items-center gap-2">
					<div className="p-1 bg-background/50 border border-border/40 rounded-full">
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleTheme}
							aria-label="Toggle theme"
							className="relative z-10 rounded-full h-8 w-8"
						>
							{theme === "dark" ? (
								<Sun size={16} className="text-yellow-500" />
							) : (
								<Moon size={16} className="text-slate-700" />
							)}
						</Button>
					</div>

					<button
						className="relative z-10 p-2 rounded-full hover:bg-primary/10 transition-colors"
						onClick={toggleMenu}
						aria-label="Toggle menu"
					>
						{isOpen ? <X size={20} /> : <Menu size={20} />}
					</button>
				</div>

				{/* Mobile Menu */}
				<div
					className={cn(
						"absolute top-0 left-0 w-full h-screen bg-background backdrop-blur-md md:hidden",
						"transition-transform duration-500 ease-in-out flex flex-col",
						isOpen ? "translate-y-0" : "translate-y-full",
					)}
				>
					<div className="hidden md:flex justify-end p-4">
						<button
							className="p-2 rounded-full hover:bg-primary/10 transition-colors"
							onClick={toggleMenu}
							aria-label="Close menu"
						>
							<X size={20} />
						</button>
					</div>

					<nav className="flex flex-col items-center justify-center flex-1 space-y-4 px-8 py-10 mt-6">
						{navLinks.map((link, index) => (
							<Link
								key={link.path}
								to={link.path}
								className={cn(
									"text-xl font-medium transition-all px-6 py-3 rounded-full",
									"transform transition-transform",
									isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
									location.pathname === link.path
										? "text-primary bg-primary/10 font-semibold"
										: "text-foreground/80 hover:bg-primary/5",
								)}
								style={{ transitionDelay: `${index * 50}ms` }}
							>
								{link.title}
							</Link>
						))}

						{user ? (
							<Button
								className="mt-4 rounded-full px-6 py-6 text-lg"
								style={{
									transitionDelay: `${navLinks.length * 50}ms`,
									opacity: isOpen ? 1 : 0,
									transform: isOpen ? "translateY(0)" : "translateY(1rem)",
								}}
								asChild
							>
								<Link to="/cms/dashboard">
									<User size={18} className="mr-2" /> Dashboard
								</Link>
							</Button>
						) : (
							<Button
								className="mt-4 rounded-full px-6 py-6 text-lg"
								style={{
									transitionDelay: `${navLinks.length * 50}ms`,
									opacity: isOpen ? 1 : 0,
									transform: isOpen ? "translateY(0)" : "translateY(1rem)",
								}}
								asChild
							>
								<Link to="/hire-me">
									<Zap size={18} className="mr-2" /> Hire Me
								</Link>
							</Button>
						)}
					</nav>

					<div className="px-8 pb-10 text-center text-sm text-muted-foreground">
						<p>© {new Date().getFullYear()} Nanthakumar</p>
					</div>
				</div>
			</div>
		</header>
	);
};
