import PowerfulCTACard from "@/components/cards/powerful-cta-card";
import { ProjectCard } from "@/components/cards/project-card";
import { SEO } from "@/components/common/seo";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { services } from "@/data/services";
import { getCtaDataForPage } from "@/lib/get-cta-data-for-page";
import { cn } from "@/lib/utils";
import { projectService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router";

const Home = () => {
	const ctaData = getCtaDataForPage("home");

	const { data: projects = [], isLoading: isProjectsLoading } = useQuery({
		queryKey: ["latestProjects"],
		queryFn: () => projectService.getFeaturedProjects(),
	});

	return (
		<>
			<SEO
				title="Home"
				description="I'm Nanthakumar, a Technical Architect and Full Stack Engineer passionate about crafting high-performance web applications and building scalable systems"
				type="website"
			/>

			<div className="space-y-12 md:space-y-24">
				<section className="pt-16 md:pt-24 lg:pt-28 relative overflow-hidden">
					<div className="container px-4 max-w-6xl mx-auto">
						<div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16 md:py-8">
							<div className="lg:w-1/2 animate-fade-in">
								<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-6">
									<Sparkles size={16} />
									TECHNICAL ARCHITECT
								</div>

								<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
									I'm <span className="text-primary">Nanthakumar</span>,
								</h1>

								<p className="text-lg text-muted-foreground mb-8 leading-relaxed">
									a{" "}
									<span className="font-semibold">
										Technical Architect and Full Stack Engineer{" "}
									</span>{" "}
									passionate about crafting high-performance web applications and building scalable
									systems, seamless API integrations, and intuitive user experiences. Let's bring
									your ideas to life with speed, creativity, and precision.
								</p>

								<div className="flex flex-wrap gap-4">
									<Button asChild size="lg" className="rounded-full px-8 group">
										<Link to="/hire-me">
											<Sparkles size={16} className="mr-2 animate-pulse" />
											Hire Me
										</Link>
									</Button>
									<Button asChild variant="outline" size="lg" className="rounded-full px-8 group">
										<Link to="/contact" className="hover:text-white">
											Contact me
											<ChevronRight
												size={16}
												className="ml-1 group-hover:translate-x-1 transition-transform"
											/>
										</Link>
									</Button>
								</div>
							</div>

							<div className="lg:w-1/2 animate-scale-in">
								<div className="relative group">
									<div
										className={clsx(
											"absolute rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-500",
											"-inset-2 bg-gradient-to-tr from-primary/30 to-primary/60",
											"dark:from-primary/50 dark:to-primary/90",
										)}
									></div>
									<div className="relative rounded-2xl overflow-hidden shadow-xl border border-border/50">
										{/* <VideoPlayer
											src="https://player.vimeo.com/external/470408840.hd.mp4?s=aba7a4397a64f3ba9cb3e188ef6e6e54f0be1f28&profile_id=175&oauth2_token_id=57447761"
											poster="https://cdn.sundflow.cloud/f/1e82b1642eed233f9"
											className="aspect-video bg-muted"
										/> */}
										<img
											src="https://pub-2ab98e96400d470096cf10abb107a2c8.r2.dev/home_brand_confidence.svg"
											alt="Confidence"
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="py-24 relative overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
					<div className="container px-4 max-w-6xl mx-auto">
						<SectionHeader
							title="What I Do"
							subtitle="Services"
							description="Delivering high-quality web solutions with modern technologies and best practices"
							className="text-center mb-16"
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{services.map((service, index) => {
								const Icon = service.icon;
								return (
									<div
										key={index}
										className={cn(
											"group bg-background border border-border/50 rounded-xl p-8",
											"hover:border-primary/30 dark:hover:border-primary/70 hover:shadow-lg transition-all duration-300",
											"flex flex-col h-full",
										)}
										style={{ animationDelay: service.delay }}
									>
										<div className="p-4 bg-primary/10 rounded-xl text-primary mb-6 w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
											<Icon size={24} />
										</div>
										<h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
											{service.title}
										</h3>
										<p className="text-muted-foreground leading-relaxed flex-grow">
											{service.description}
										</p>
									</div>
								);
							})}
						</div>

						<div className="mt-16 text-center">
							<Button asChild variant="outline" size="lg" className="rounded-full px-8 group">
								<Link to="/services" className="hover:text-white">
									Request Services
									<ArrowRight
										size={16}
										className="ml-2 group-hover:translate-x-1 transition-transform"
									/>
								</Link>
							</Button>
						</div>
					</div>
				</section>

				<section className="py-24 relative overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
					<div className="container px-4 max-w-6xl mx-auto">
						<SectionHeader
							title="Featured Projects"
							subtitle="My Work"
							className="text-center mb-16"
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{isProjectsLoading
								? // Loading placeholders
									Array.from({ length: 3 }).map((_, i) => (
										<div key={i} className="bg-muted/30 h-[420px] rounded-xl animate-pulse" />
									))
								: projects.map((project, index) => (
										<ProjectCard
											key={project.id}
											project={project}
											className="animate-fade-in"
											style={{ animationDelay: `${index * 0.1}s` }}
										/>
									))}
						</div>

						<div className="mt-16 text-center">
							<Button asChild variant="outline" size="lg" className="rounded-full px-8 group">
								<Link to="/projects" className="hover:text-white">
									View all projects
									<ArrowRight
										size={16}
										className="ml-2 group-hover:translate-x-1 transition-transform"
									/>
								</Link>
							</Button>
						</div>
					</div>
				</section>

				<section className="py-24 !mt-6">
					<div className="container px-4 max-w-6xl mx-auto">
						<PowerfulCTACard {...ctaData} />
					</div>
				</section>
			</div>
		</>
	);
};

export default Home;
