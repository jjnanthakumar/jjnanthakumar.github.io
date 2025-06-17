"use client";

import PowerfulCTACard from "@/components/cards/powerful-cta-card";
import { SEO } from "@/components/common/seo";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { skills, experiences, education } from "@/data/about";
import { getCtaDataForPage } from "@/lib/get-cta-data-for-page";
import { cn } from "@/lib/utils";
import {
	ArrowRight,
	Award,
	BriefcaseIcon,
	Calendar,
	CheckCircle,
	ChevronRight,
	GraduationCap,
	MapPin,
	Rocket,
	Sparkles,
	User,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";


const About = () => {
	const ctaData = getCtaDataForPage("about");
	const [activeTab, setActiveTab] = useState("experience");

	return (
		<div className="space-y-24">
			<SEO
				title="About"
				description="Learn more about Nanthakumar, a frontend software engineer specializing in React, Vue, and modern web technologies. Discover my journey, skills, and approach to development"
				type="website"
			/>
			{/* Hero Section */}
			<section className="relative overflow-hidden pt-8 md:pt-16">
				{/* <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div> */}
				<div className="container max-w-7xl px-4 relative">
					<div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
						<div className="lg:w-2/5 animate-scale-in">
							<div className="relative group">
								<div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-primary/40 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-500"></div>
								<div className="relative aspect-square rounded-2xl overflow-hidden bg-background shadow-xl border border-border/50">
									<img
										src="https://pub-2ab98e96400d470096cf10abb107a2c8.r2.dev/profile.png"
										alt="Profile"
										className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<div className="absolute bottom-4 left-4 right-4">
											<div className="flex gap-2 justify-center">
												<span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
													Technical Architect
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="mt-6 flex flex-wrap gap-3 justify-center">
								<div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
									<Calendar size={16} />
									4+ Years Experience
								</div>
								<div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 font-medium">
									<CheckCircle size={16} />
									Available for Hire
								</div>
							</div>
						</div>

						<div className="lg:w-3/5 animate-fade-in">
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-6">
								<User size={16} />
								ABOUT ME
							</div>

							<h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 tracking-tight leading-tight">
								Technical Architect <span className="text-primary">&</span> Python Enthusiast
							</h1>

							<div className="space-y-4 text-lg text-muted-foreground mb-8 leading-relaxed">
								<p>
									<b>
										I'm <span className="text-primary">Nanthakumar</span> J J
									</b>{" "}
									, a <b>Python-loving Technical Architect</b> and Cloud Solutions Engineer with a
									mission: building scalable, innovative software that solves real-world problems.
									With over 4 years of experience in agile DevOps environments, I bridge the gap
									between code and cloud—designing robust systems, optimizing pipelines, and turning
									ideas into high-impact products.
								</p>
								<p>
									I architect scalable Python systems on Azure, blending clean code with
									cloud-native resilience. My solutions prioritize performance and user experience,
									from backend logic to seamless deployment. Every line of code is built to
									last—secure, maintainable, and future-proof.
								</p>
								<p>
									When I'm not coding, you'll find me exploring new technologies, experimenting with
									new frameworks, or helping developer community.
								</p>
							</div>

							<div className="flex flex-wrap gap-4">
								<Button asChild size="lg" className="rounded-full px-8 group">
									<Link to="/hire-me">
										<Sparkles size={16} className="mr-2" />
										Hire Me
									</Link>
								</Button>
								<Button asChild variant="outline" size="lg" className="rounded-full px-8 group">
									<Link to="/projects" className="hover:text-white">
										View My Work
										<ChevronRight
											size={16}
											className="ml-1 group-hover:translate-x-1 transition-transform"
										/>
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Skills Section */}
			<section className="py-20 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
				<div className="container max-w-7xl px-4 relative">
					<SectionHeader title="My Skills" subtitle="Expertise" className="mb-16 text-center" />

					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
						{skills.map((skill, index) => (
							<div
								key={skill}
								className={cn(
									"p-4 bg-background rounded-xl border-2 border-border/10 shadow-sm",
									"hover:border-primary/80 dark:hover:border-primary/90 hover:shadow-md transition-all duration-300",
									"flex items-center justify-center text-center",
								)}
								style={{ animationDelay: `${index * 0.05}s` }}
							>
								<span className="font-medium">{skill}</span>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Experience & Education Section */}
			<section className="py-7 relative">
				<div className="container max-w-7xl px-4">
					<SectionHeader
						title={activeTab === "experience" ? "Work Experience" : "Education & Certification"}
						subtitle={activeTab === "experience" ? "My Journey" : "My Academic Background"}
						description="Explore my professional experience and educational background"
						className="mb-16 text-center"
					/>

					{/* Interactive Tabs */}
					<div className="flex justify-center mb-12">
						<div className="inline-flex p-1 rounded-full bg-muted">
							<button
								onClick={() => setActiveTab("experience")}
								className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
									activeTab === "experience"
										? "bg-primary text-primary-foreground shadow-md"
										: "hover:bg-muted-foreground/10"
								}`}
							>
								<BriefcaseIcon size={16} />
								Experience
							</button>
							<button
								onClick={() => setActiveTab("education")}
								className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
									activeTab === "education"
										? "bg-primary text-primary-foreground shadow-md"
										: "hover:bg-muted-foreground/10"
								}`}
							>
								<GraduationCap size={16} />
								Education
							</button>
						</div>
					</div>

					{/* Experience Content */}
					<div className={`${activeTab === "experience" ? "block" : "hidden"}`}>
						<div className="relative">
							{/* Timeline line */}
							<div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/80 via-primary/50 to-primary/20 hidden md:block"></div>

							<div className="space-y-20">
								{experiences.map((exp, index) => (
									<div key={index} className="relative">
										<div
											className={`md:flex items-stretch ${index % 2 === 0 ? "" : "md:flex-row-reverse"}`}
										>
											{/* Timeline dot */}
											<div className="absolute left-1/2 top-0 -translate-x-1/2 hidden md:flex items-center justify-center">
												<div className="w-14 h-14 rounded-full bg-primary border-4 border-background flex items-center justify-center z-10 shadow-lg">
													<BriefcaseIcon size={22} className="text-primary-foreground" />
												</div>
											</div>

											{/* Date pill - mobile only */}
											<div className="md:hidden mb-4 flex justify-center">
												<div className="px-4 py-1.5 bg-primary/10 text-primary text-sm rounded-full font-medium inline-flex items-center">
													<Calendar size={14} className="mr-1.5" />
													{exp.period}
												</div>
											</div>

											{/* Content */}
											<div className="md:w-1/2 md:px-8">
												<div
													className={`relative overflow-hidden bg-background border border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 group ${
														index % 2 === 0 ? "md:rounded-tr-none" : "md:rounded-tl-none"
													}`}
												>
													{/* Top accent gradient */}
													<div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/80 via-primary/50 to-primary/30"></div>

													{/* Background pattern */}
													<div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>

													{/* Content wrapper */}
													<div className="p-7 relative">
														{/* Title and company */}
														<div className="pr-16">
															<h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors duration-300">
																{exp.title}
															</h3>
															<div className="text-lg font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
																{exp.company}
															</div>
														</div>

														{/* Info badges */}
														<div className="flex flex-wrap gap-3 mt-5">
															<div className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-primary/5 dark:bg-muted rounded-full text-sm font-medium">
																<Calendar size={15} className="text-primary" />
																<span>{exp.period}</span>
															</div>

															<div className="flex items-center gap-1.5 px-4 py-2 bg-primary/5 dark:bg-muted rounded-full text-sm font-medium">
																<MapPin size={15} className="text-primary" />
																<span>{exp.location}</span>
															</div>
														</div>

														{/* Description with PRAQ format */}
														{exp.description && (
															<div className="mt-5 text-muted-foreground leading-relaxed">
																{exp.description.split(". ").map((sentence, i) => {
																	return (
																		<p key={i} className="mb-2">
																			<span className="font-semibold text-primary">{"⚡"} </span>
																			{sentence}
																		</p>
																	);
																})}
															</div>
														)}

														{/* Hover indicator */}
														<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
													</div>
												</div>
											</div>

											{/* Empty space for timeline layout */}
											<div className="hidden md:block md:w-1/2"></div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Education Content */}
					<div className={`${activeTab === "education" ? "block" : "hidden"}`}>
						<div className="grid gap-8 md:grid-cols-3">
							{education.map((edu, index) => (
								<div
									key={index}
									className="group bg-background border border-border/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
								>
									<div className="h-3 bg-gradient-to-r from-primary/80 to-primary/40"></div>
									<div className="p-6">
										<div className="flex justify-between items-start mb-4">
											<div className="p-3 bg-primary/10 rounded-xl text-primary">
												<GraduationCap size={24} />
											</div>
											<div className="px-4 py-1.5 bg-primary/10 text-primary text-sm rounded-full font-medium inline-flex items-center">
												<Calendar size={14} className="mr-1.5" />
												{edu.period}
											</div>
										</div>

										<h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
											{edu.degree}
										</h3>

										<div className="text-lg font-medium mb-3">{edu.institution}</div>

										{edu.description && <p className="text-muted-foreground">{edu.description}</p>}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* New highlights section */}
			<section className="py-16 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
				<div className="container max-w-6xl px-4">
					<SectionHeader
						title="Why Work With Me?"
						subtitle="My Approach"
						description="I bring a unique blend of technical expertise and user-focused design thinking to every project."
						className="text-center mb-16"
					/>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						<div className="bg-background border border-border/50 rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/30 dark:hover:border-primary/70 group">
							<div className="p-4 bg-primary/10 rounded-xl text-primary mb-6 w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
								<Rocket size={24} />
							</div>
							<h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
								Fast Delivery
							</h3>
							<p className="text-muted-foreground leading-relaxed">
								I work efficiently to deliver high-quality results within agreed timeframes,
								ensuring your project launches on schedule.
							</p>
						</div>

						<div className="bg-background border border-border/50 rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/30 dark:hover:border-primary/70 group">
							<div className="p-4 bg-primary/10 rounded-xl text-primary mb-6 w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
								<Zap size={24} />
							</div>
							<h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
								Performance Focused
							</h3>
							<p className="text-muted-foreground leading-relaxed">
								I build applications with performance in mind, optimizing every aspect to ensure
								fast loading times and smooth interactions.
							</p>
						</div>

						<div className="bg-background border border-border/50 rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/30 dark:hover:border-primary/70 group">
							<div className="p-4 bg-primary/10 rounded-xl text-primary mb-6 w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
								<Award size={24} />
							</div>
							<h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
								Quality Guaranteed
							</h3>
							<p className="text-muted-foreground leading-relaxed">
								I'm committed to excellence in every project, with attention to detail that ensures
								a polished, professional final product.
							</p>
						</div>
					</div>

					<div className="mt-12 text-center">
						<Button asChild variant="outline" size="lg" className="rounded-full px-8 group">
							<Link to="/services" className="hover:text-white">
								Explore My Services
								<ArrowRight
									size={16}
									className="ml-2 group-hover:translate-x-1 transition-transform"
								/>
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Enhanced Hire Me Section with ContactCTA */}
			<section className="pb-16">
				<div className="container max-w-6xl px-4 mx-auto">
					<PowerfulCTACard {...ctaData} />
				</div>
			</section>
		</div>
	);
};

export default About;
