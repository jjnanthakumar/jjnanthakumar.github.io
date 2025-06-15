import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MY_USER_ID } from "@/constants/app";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
	ArrowRight,
	BookOpen,
	CalendarDays,
	ExternalLink,
	Github,
	Linkedin,
	Mail,
	MapPin,
	MessageCircle,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const AuthorBio = () => {
	const [authorData, setAuthorData] = useState<TAny>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchAuthorData = async () => {
			try {
				// Fetch the admin user profile
				const userDocRef = doc(db, "users", MY_USER_ID);
				const userDoc = await getDoc(userDocRef);

				if (userDoc.exists()) {
					setAuthorData(userDoc.data());
				}
			} catch (error) {
				console.error("Error fetching author data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAuthorData();
	}, []);

	// Social profiles - can be customized from profile page
	const socialLinks = [
		{
			name: "LinkedIn",
			url: authorData?.linkedinUrl || "https://linkedin.com/in/jjnanthakumar",
			icon: <Linkedin size={16} />,
		},
		{
			name: "GitHub",
			url: authorData?.githubUrl || "https://github.com/jjnanthakumar",
			icon: <Github size={16} />,
		},
		{
			name: "Email",
			url: `mailto:${authorData?.email || "jjnanthakumar477@gmail.com"}`,
			icon: <Mail size={16} />,
		},
	];

	return (
		<Card className="mt-8 overflow-hidden border border-primary/20 animate-fade-in">
			<div className="bg-gradient-to-r from-primary/10 to-primary/5 p-1"></div>
			<CardContent className="p-0">
				{isLoading ? (
					<div className="p-6 flex gap-4">
						<Skeleton className="h-20 w-20 rounded-full" />
						<div className="space-y-2 flex-1">
							<Skeleton className="h-5 w-40" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-full" />
							<div className="flex gap-2 pt-2">
								<Skeleton className="h-9 w-24" />
								<Skeleton className="h-9 w-24" />
							</div>
						</div>
					</div>
				) : (
					<div className="p-6">
						<div className="flex flex-col sm:flex-row gap-6">
							{/* Avatar and social links column */}
							<div className="sm:w-1/4 flex flex-col items-center sm:border-r sm:border-border/30 pr-6">
								<div className="relative group">
									<div className="absolute -inset-1.5 bg-gradient-to-r from-primary/50 to-primary/30 dark:from-primary/80 dark:to-primary/50 rounded-full opacity-75 blur-sm group-hover:opacity-100 transition duration-500"></div>
									<Avatar className="w-32 h-32 md:h-28 md:w-28 border-2 border-background relative">
										<AvatarImage
											src={authorData?.photoURL || "https://github.com/shadcn.png"}
											alt={authorData?.displayName || "Author"}
										/>
										<AvatarFallback>{authorData?.displayName?.[0] || "A"}</AvatarFallback>
									</Avatar>
								</div>

								{/* Location */}
								{authorData?.location && (
									<div className="mt-3 text-sm text-center text-muted-foreground flex items-center">
										<MapPin size={14} className="mr-1 shrink-0" />
										{authorData.location}
									</div>
								)}

								{/* Social links */}
								<div className="flex gap-2 mt-4 justify-center">
									<TooltipProvider>
										{socialLinks.map((link, index) => (
											<Tooltip key={index}>
												<TooltipTrigger asChild>
													<Button
														size="icon"
														variant="ghost"
														className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
														asChild
													>
														<a href={link.url} target="_blank" rel="noopener noreferrer">
															{link.icon}
														</a>
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													<p>{link.name}</p>
												</TooltipContent>
											</Tooltip>
										))}
									</TooltipProvider>
								</div>
							</div>

							{/* Bio and CTA column */}
							<div className="sm:w-3/4">
								<div className="flex items-center gap-2 mb-1 text-sm font-medium text-primary rounded-full bg-primary/10 px-3 py-1.5 w-fit">
									<User size={14} />
									AUTHOR
								</div>
								<h3 className="text-xl font-bold mb-2 group">
									{authorData?.displayName || "Author"}
									<span className="inline-block w-2 h-2 bg-primary rounded-full ml-1 animate-pulse"></span>
								</h3>
								<p className="text-muted-foreground mb-4">
									{authorData?.bio ||
										"Frontend developer passionate about creating beautiful, functional, and user-friendly web applications."}
								</p>

								{/* Call-to-actions */}
								<div className="flex flex-wrap gap-3 mt-4">
									<Button variant="outline" size="sm" className="group" asChild>
										<Link to="/about">
											<BookOpen size={14} className="mr-1" />
											About Me
											<ArrowRight
												size={14}
												className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
											/>
										</Link>
									</Button>
									<Button variant="outline" size="sm" className="group" asChild>
										<Link to="/contact">
											<MessageCircle size={14} className="mr-1" />
											Contact Me
											<ArrowRight
												size={14}
												className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
											/>
										</Link>
									</Button>
									<Button
										variant="default"
										size="sm"
										className="group bg-primary/90 hover:bg-primary"
										asChild
									>
										<Link to="/book-consultation">
											<CalendarDays size={14} className="mr-1" />
											Book Consultation
											<ExternalLink
												size={14}
												className="ml-1 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all"
											/>
										</Link>
									</Button>
								</div>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default AuthorBio;
