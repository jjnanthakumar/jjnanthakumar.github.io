"use client";

import { CmsLayout } from "@/components/layout/cms-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/hooks/use-theme";
import { db } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Bell, Globe, Info, Laptop, Loader2, Moon, Palette, Save, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Appearance form schema
const appearanceFormSchema = z.object({
	theme: z.enum(["light", "dark", "system"], {
		required_error: "Please select a theme",
	}),
	colorScheme: z.enum(["blue", "green", "purple", "orange", "pink"], {
		required_error: "Please select a color scheme",
	}),
});

// Notification form schema
const notificationFormSchema = z.object({
	emailNotifications: z.boolean().default(true),
	marketingEmails: z.boolean().default(false),
	newCommentNotifications: z.boolean().default(true),
	mentionNotifications: z.boolean().default(true),
});

// Site settings form schema
const siteSettingsFormSchema = z.object({
	language: z.string({
		required_error: "Please select a language",
	}),
	timezone: z.string({
		required_error: "Please select a timezone",
	}),
	dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"], {
		required_error: "Please select a date format",
	}),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;
type NotificationFormValues = z.infer<typeof notificationFormSchema>;
type SiteSettingsFormValues = z.infer<typeof siteSettingsFormSchema>;

const CmsSettings = () => {
	const { user } = useAuth();
	const { theme, setTheme } = useTheme();
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingSettings, setIsLoadingSettings] = useState(true);
	const [userSettings, setUserSettings] = useState<TAny>(null);

	// Appearance form
	const appearanceForm = useForm<AppearanceFormValues>({
		resolver: zodResolver(appearanceFormSchema),
		defaultValues: {
			theme: "system",
			colorScheme: "blue",
		},
	});

	// Notification form
	const notificationForm = useForm<NotificationFormValues>({
		resolver: zodResolver(notificationFormSchema),
		defaultValues: {
			emailNotifications: true,
			marketingEmails: false,
			newCommentNotifications: true,
			mentionNotifications: true,
		},
	});

	// Site settings form
	const siteSettingsForm = useForm<SiteSettingsFormValues>({
		resolver: zodResolver(siteSettingsFormSchema),
		defaultValues: {
			language: "en",
			timezone: "UTC",
			dateFormat: "MM/DD/YYYY",
		},
	});

	// Fetch user settings
	useEffect(() => {
		const fetchUserSettings = async () => {
			if (!user) return;

			try {
				const userSettingsRef = doc(db, "userSettings", user.uid);
				const userSettingsDoc = await getDoc(userSettingsRef);

				if (userSettingsDoc.exists()) {
					const settingsData = userSettingsDoc.data();
					setUserSettings(settingsData);

					// Update appearance form
					appearanceForm.reset({
						theme: settingsData.theme || "system",
						colorScheme: settingsData.colorScheme || "blue",
					});

					// Update notification form
					notificationForm.reset({
						emailNotifications: settingsData.emailNotifications ?? true,
						marketingEmails: settingsData.marketingEmails ?? false,
						newCommentNotifications: settingsData.newCommentNotifications ?? true,
						mentionNotifications: settingsData.mentionNotifications ?? true,
					});

					// Update site settings form
					siteSettingsForm.reset({
						language: settingsData.language || "en",
						timezone: settingsData.timezone || "UTC",
						dateFormat: settingsData.dateFormat || "MM/DD/YYYY",
					});
				} else {
					// If user settings don't exist, create them with default values
					const defaultSettings = {
						theme: "system",
						colorScheme: "blue",
						emailNotifications: true,
						marketingEmails: false,
						newCommentNotifications: true,
						mentionNotifications: true,
						language: "en",
						timezone: "UTC",
						dateFormat: "MM/DD/YYYY",
						createdAt: new Date(),
					};
					setUserSettings(defaultSettings);
				}
			} catch (error) {
				console.error("Error fetching user settings:", error);
				toast.error("Failed to load settings");
			} finally {
				setIsLoadingSettings(false);
			}
		};

		fetchUserSettings();
	}, [user, appearanceForm, notificationForm, siteSettingsForm]);

	// Handle appearance form submission
	const onAppearanceSubmit = async (data: AppearanceFormValues) => {
		if (!user) return;

		setIsLoading(true);
		try {
			// Update theme
			// setTheme(data.theme)

			// Update Firestore document
			const userSettingsRef = doc(db, "userSettings", user.uid);
			await updateDoc(userSettingsRef, {
				theme: data.theme,
				colorScheme: data.colorScheme,
				updatedAt: new Date(),
			});

			toast.success("Appearance settings updated");
		} catch (error) {
			console.error("Error updating appearance settings:", error);
			toast.error("Failed to update appearance settings");
		} finally {
			setIsLoading(false);
		}
	};

	// Handle notification form submission
	const onNotificationSubmit = async (data: NotificationFormValues) => {
		if (!user) return;

		setIsLoading(true);
		try {
			// Update Firestore document
			const userSettingsRef = doc(db, "userSettings", user.uid);
			await updateDoc(userSettingsRef, {
				emailNotifications: data.emailNotifications,
				marketingEmails: data.marketingEmails,
				newCommentNotifications: data.newCommentNotifications,
				mentionNotifications: data.mentionNotifications,
				updatedAt: new Date(),
			});

			toast.success("Notification settings updated");
		} catch (error) {
			console.error("Error updating notification settings:", error);
			toast.error("Failed to update notification settings");
		} finally {
			setIsLoading(false);
		}
	};

	// Handle site settings form submission
	const onSiteSettingsSubmit = async (data: SiteSettingsFormValues) => {
		if (!user) return;

		setIsLoading(true);
		try {
			// Update Firestore document
			const userSettingsRef = doc(db, "userSettings", user.uid);
			await updateDoc(userSettingsRef, {
				language: data.language,
				timezone: data.timezone,
				dateFormat: data.dateFormat,
				updatedAt: new Date(),
			});

			toast.success("Site settings updated");
		} catch (error) {
			console.error("Error updating site settings:", error);
			toast.error("Failed to update site settings");
		} finally {
			setIsLoading(false);
		}
	};

	if (!user) {
		return null;
	}

	return (
		<CmsLayout>
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Settings</h1>
					<p className="text-muted-foreground">Manage your application settings and preferences</p>
				</div>

				<Tabs defaultValue="appearance" className="space-y-6">
					<TabsList className="bg-muted/50">
						<TabsTrigger value="appearance" className="data-[state=active]:bg-background">
							<Palette className="h-4 w-4 mr-2" />
							Appearance
						</TabsTrigger>
						<TabsTrigger value="notifications" className="data-[state=active]:bg-background">
							<Bell className="h-4 w-4 mr-2" />
							Notifications
						</TabsTrigger>
						<TabsTrigger value="site" className="data-[state=active]:bg-background">
							<Globe className="h-4 w-4 mr-2" />
							Site Settings
						</TabsTrigger>
					</TabsList>

					<TabsContent value="appearance" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Appearance</CardTitle>
								<CardDescription>
									Customize the appearance of the application. Choose between light and dark mode.
								</CardDescription>
							</CardHeader>
							<CardContent>
								{isLoadingSettings ? (
									<div className="flex justify-center py-6">
										<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
									</div>
								) : (
									<Form {...appearanceForm}>
										<form
											onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)}
											className="space-y-8"
										>
											<FormField
												control={appearanceForm.control}
												name="theme"
												render={({ field }) => (
													<FormItem className="space-y-4">
														<FormLabel>Theme</FormLabel>
														<FormDescription>Select the theme for the dashboard.</FormDescription>
														<FormControl>
															<RadioGroup
																onValueChange={field.onChange}
																defaultValue={field.value}
																className="grid grid-cols-3 gap-4"
															>
																<FormItem className="flex flex-col items-center space-y-2">
																	<FormControl>
																		<RadioGroupItem
																			value="light"
																			className="sr-only"
																			id="theme-light"
																		/>
																	</FormControl>
																	<label
																		htmlFor="theme-light"
																		className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
																			field.value === "light" ? "border-primary" : ""
																		}`}
																	>
																		<Sun className="h-5 w-5 mb-2" />
																		<span className="text-sm font-medium">Light</span>
																	</label>
																</FormItem>
																<FormItem className="flex flex-col items-center space-y-2">
																	<FormControl>
																		<RadioGroupItem
																			value="dark"
																			className="sr-only"
																			id="theme-dark"
																		/>
																	</FormControl>
																	<label
																		htmlFor="theme-dark"
																		className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
																			field.value === "dark" ? "border-primary" : ""
																		}`}
																	>
																		<Moon className="h-5 w-5 mb-2" />
																		<span className="text-sm font-medium">Dark</span>
																	</label>
																</FormItem>
																<FormItem className="flex flex-col items-center space-y-2">
																	<FormControl>
																		<RadioGroupItem
																			value="system"
																			className="sr-only"
																			id="theme-system"
																		/>
																	</FormControl>
																	<label
																		htmlFor="theme-system"
																		className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
																			field.value === "system" ? "border-primary" : ""
																		}`}
																	>
																		<Laptop className="h-5 w-5 mb-2" />
																		<span className="text-sm font-medium">System</span>
																	</label>
																</FormItem>
															</RadioGroup>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={appearanceForm.control}
												name="colorScheme"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Color Scheme</FormLabel>
														<FormDescription>
															Select the color scheme for the dashboard.
														</FormDescription>
														<Select onValueChange={field.onChange} defaultValue={field.value}>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select a color scheme" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="blue">Blue</SelectItem>
																<SelectItem value="green">Green</SelectItem>
																<SelectItem value="purple">Purple</SelectItem>
																<SelectItem value="orange">Orange</SelectItem>
																<SelectItem value="pink">Pink</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											<Button type="submit" disabled={isLoading}>
												{isLoading ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														Saving...
													</>
												) : (
													<>
														<Save className="mr-2 h-4 w-4" />
														Save Changes
													</>
												)}
											</Button>
										</form>
									</Form>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="notifications" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Notification Settings</CardTitle>
								<CardDescription>
									Configure how you receive notifications from the application.
								</CardDescription>
							</CardHeader>
							<CardContent>
								{isLoadingSettings ? (
									<div className="flex justify-center py-6">
										<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
									</div>
								) : (
									<Form {...notificationForm}>
										<form
											onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}
											className="space-y-8"
										>
											<Alert variant="default" className="bg-muted/50">
												<Info className="h-4 w-4" />
												<AlertTitle>Email Notifications</AlertTitle>
												<AlertDescription>
													Configure your email notification preferences. You can change these
													settings at any time.
												</AlertDescription>
											</Alert>

											<div className="space-y-4">
												<FormField
													control={notificationForm.control}
													name="emailNotifications"
													render={({ field }) => (
														<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
															<div className="space-y-0.5">
																<FormLabel className="text-base">Email Notifications</FormLabel>
																<FormDescription>
																	Receive email notifications for important updates.
																</FormDescription>
															</div>
															<FormControl>
																<Switch checked={field.value} onCheckedChange={field.onChange} />
															</FormControl>
														</FormItem>
													)}
												/>

												<FormField
													control={notificationForm.control}
													name="marketingEmails"
													render={({ field }) => (
														<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
															<div className="space-y-0.5">
																<FormLabel className="text-base">Marketing Emails</FormLabel>
																<FormDescription>
																	Receive emails about new features and special offers.
																</FormDescription>
															</div>
															<FormControl>
																<Switch checked={field.value} onCheckedChange={field.onChange} />
															</FormControl>
														</FormItem>
													)}
												/>
											</div>

											<Separator />

											<Alert variant="default" className="bg-muted/50">
												<Bell className="h-4 w-4" />
												<AlertTitle>In-App Notifications</AlertTitle>
												<AlertDescription>
													Configure your in-app notification preferences.
												</AlertDescription>
											</Alert>

											<div className="space-y-4">
												<FormField
													control={notificationForm.control}
													name="newCommentNotifications"
													render={({ field }) => (
														<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
															<div className="space-y-0.5">
																<FormLabel className="text-base">New Comments</FormLabel>
																<FormDescription>
																	Receive notifications when someone comments on your content.
																</FormDescription>
															</div>
															<FormControl>
																<Switch checked={field.value} onCheckedChange={field.onChange} />
															</FormControl>
														</FormItem>
													)}
												/>

												<FormField
													control={notificationForm.control}
													name="mentionNotifications"
													render={({ field }) => (
														<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
															<div className="space-y-0.5">
																<FormLabel className="text-base">Mentions</FormLabel>
																<FormDescription>
																	Receive notifications when someone mentions you.
																</FormDescription>
															</div>
															<FormControl>
																<Switch checked={field.value} onCheckedChange={field.onChange} />
															</FormControl>
														</FormItem>
													)}
												/>
											</div>

											<Button type="submit" disabled={isLoading}>
												{isLoading ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														Saving...
													</>
												) : (
													<>
														<Save className="mr-2 h-4 w-4" />
														Save Changes
													</>
												)}
											</Button>
										</form>
									</Form>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="site" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Site Settings</CardTitle>
								<CardDescription>Configure general settings for the application.</CardDescription>
							</CardHeader>
							<CardContent>
								{isLoadingSettings ? (
									<div className="flex justify-center py-6">
										<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
									</div>
								) : (
									<Form {...siteSettingsForm}>
										<form
											onSubmit={siteSettingsForm.handleSubmit(onSiteSettingsSubmit)}
											className="space-y-8"
										>
											<FormField
												control={siteSettingsForm.control}
												name="language"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Language</FormLabel>
														<Select onValueChange={field.onChange} defaultValue={field.value}>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select a language" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="en">English</SelectItem>
																<SelectItem value="es">Spanish</SelectItem>
																<SelectItem value="fr">French</SelectItem>
																<SelectItem value="de">German</SelectItem>
																<SelectItem value="ja">Japanese</SelectItem>
															</SelectContent>
														</Select>
														<FormDescription>
															Select your preferred language for the application.
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={siteSettingsForm.control}
												name="timezone"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Timezone</FormLabel>
														<Select onValueChange={field.onChange} defaultValue={field.value}>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select a timezone" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="UTC">UTC</SelectItem>
																<SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
																<SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
																<SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
																<SelectItem value="America/Los_Angeles">
																	Pacific Time (PT)
																</SelectItem>
																<SelectItem value="Europe/London">London</SelectItem>
																<SelectItem value="Europe/Paris">Paris</SelectItem>
																<SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
															</SelectContent>
														</Select>
														<FormDescription>
															Select your timezone for accurate time display.
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={siteSettingsForm.control}
												name="dateFormat"
												render={({ field }) => (
													<FormItem className="space-y-4">
														<FormLabel>Date Format</FormLabel>
														<FormDescription>Select your preferred date format.</FormDescription>
														<FormControl>
															<RadioGroup
																onValueChange={field.onChange}
																defaultValue={field.value}
																className="flex flex-col space-y-1"
															>
																<FormItem className="flex items-center space-x-3 space-y-0">
																	<FormControl>
																		<RadioGroupItem value="MM/DD/YYYY" />
																	</FormControl>
																	<FormLabel className="font-normal">
																		MM/DD/YYYY (e.g., 12/31/2023)
																	</FormLabel>
																</FormItem>
																<FormItem className="flex items-center space-x-3 space-y-0">
																	<FormControl>
																		<RadioGroupItem value="DD/MM/YYYY" />
																	</FormControl>
																	<FormLabel className="font-normal">
																		DD/MM/YYYY (e.g., 31/12/2023)
																	</FormLabel>
																</FormItem>
																<FormItem className="flex items-center space-x-3 space-y-0">
																	<FormControl>
																		<RadioGroupItem value="YYYY-MM-DD" />
																	</FormControl>
																	<FormLabel className="font-normal">
																		YYYY-MM-DD (e.g., 2023-12-31)
																	</FormLabel>
																</FormItem>
															</RadioGroup>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<Button type="submit" disabled={isLoading}>
												{isLoading ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														Saving...
													</>
												) : (
													<>
														<Save className="mr-2 h-4 w-4" />
														Save Changes
													</>
												)}
											</Button>
										</form>
									</Form>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</CmsLayout>
	);
};

export default CmsSettings;
