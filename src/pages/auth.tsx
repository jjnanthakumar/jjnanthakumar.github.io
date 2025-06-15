"use client";

import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MY_USER_ID } from "@/constants/app";
import { useAuth } from "@/contexts/auth-context";
import { useLoadingState } from "@/hooks/use-loading-state";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email" }),
	password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Auth = () => {
	const { withLoading } = useLoadingState();
	const navigate = useNavigate();
	const { signIn, signOut } = useAuth();
	const [authError, setAuthError] = useState<string | null>(null);

	const loginForm = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const loginMutation = useMutation({
		mutationFn: async (data: LoginFormValues) => {
			const userCredential = await withLoading(async () => await signIn(data.email, data.password));
			if (!userCredential || userCredential.user.uid !== MY_USER_ID) {
				await signOut();
				toast.error("Unauthorized access. Only selected user can login.");
				throw new Error("Unauthorized access. Only selected user can login.");
			}
			return userCredential;
		},
		onSuccess: () => {
			toast.success("Logged in successfully");
			navigate("/cms/dashboard");
		},
		onError: (error: Error) => {
			console.error(error);
			setAuthError(error.message || "Failed to log in. Please check your credentials.");
			toast.error("Failed to log in. Please check your credentials.");
		},
		retry: false,
	});

	const onLoginSubmit = async (data: LoginFormValues) => {
		loginMutation.mutate(data);
	};

	return (
		<Layout>
			<div className="container flex flex-col mx-auto py-12 px-4 relative mb-12">
				{/* Background decorative elements */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg">
					<div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-70"></div>
					<div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-70"></div>
				</div>

				<Card className="max-w-xl mx-auto shadow-xl border-border/50 rounded-2xl overflow-hidden backdrop-blur-sm bg-background/95">
					<CardHeader className="space-y-2 pb-6">
						<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
							<Lock className="h-6 w-6 text-primary" />
						</div>
						<CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
						<CardDescription className="text-center">
							Login to your account to access the dashboard
						</CardDescription>
					</CardHeader>

					<CardContent>
						<Tabs defaultValue="login" className="w-full">
							<TabsList className="grid w-full grid-cols-1 mb-8 rounded-lg p-1">
								<TabsTrigger
									value="login"
									className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
								>
									Login
								</TabsTrigger>
							</TabsList>

							{authError && (
								<div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4 flex items-start">
									<AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
									<span>{authError}</span>
								</div>
							)}

							<TabsContent value="login">
								<Form {...loginForm}>
									<form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
										<FormField
											control={loginForm.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground/80 font-medium">Email</FormLabel>
													<FormControl>
														<div className="relative">
															<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
															<Input
																className="pl-10 rounded-lg border-border/50 focus-visible:ring-primary/30 bg-background/80"
																placeholder="you@example.com"
																{...field}
															/>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={loginForm.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<div className="flex justify-between items-center">
														<FormLabel className="text-foreground/80 font-medium">
															Password
														</FormLabel>
														<a href="#" className="text-xs text-primary hover:underline">
															Forgot password?
														</a>
													</div>
													<FormControl>
														<div className="relative">
															<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
															<Input
																className="pl-10 rounded-lg border-border/50 focus-visible:ring-primary/30 bg-background/80"
																type="password"
																placeholder="••••••"
																{...field}
															/>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<Button
											type="submit"
											className="w-full rounded-lg h-11 mt-2 bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary group transition-all duration-300"
											disabled={loginMutation.isPending}
										>
											{loginMutation.isPending ? (
												<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											) : (
												<>
													Login
													<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
												</>
											)}
										</Button>
									</form>
								</Form>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>
		</Layout>
	);
};

export default Auth;
