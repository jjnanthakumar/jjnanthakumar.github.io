import type React from "react";

import { CmsLayout } from "@/components/layout/cms-layout";
import ImageCropper from "@/components/profile/image-cropper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { db, storage } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	EmailAuthProvider,
	reauthenticateWithCredential,
	updateEmail,
	updatePassword,
	updateProfile,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { AlertCircle, Camera, Info, Key, Loader2, Mail, Save, Shield, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Profile form schema
const profileFormSchema = z.object({
	displayName: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Please enter a valid email"),
	bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
	website: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
	location: z.string().max(100, "Location must be less than 100 characters").optional(),
});

// Password form schema
const passwordFormSchema = z
	.object({
		currentPassword: z.string().min(6, "Password must be at least 6 characters"),
		newPassword: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

// Email verification form schema
const emailVerificationFormSchema = z.object({
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type EmailVerificationFormValues = z.infer<typeof emailVerificationFormSchema>;

const CmsProfile = () => {
	const { user, signOut } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingProfile, setIsLoadingProfile] = useState(true);
	const [profileData, setProfileData] = useState<TAny>(null);
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState(false);
	const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
	const [isCropperOpen, setIsCropperOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Profile form
	const profileForm = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			displayName: user?.displayName || "",
			email: user?.email || "",
			bio: "",
			website: "",
			location: "",
		},
	});

	// Password form
	const passwordForm = useForm<PasswordFormValues>({
		resolver: zodResolver(passwordFormSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	// Email verification form
	const emailVerificationForm = useForm<EmailVerificationFormValues>({
		resolver: zodResolver(emailVerificationFormSchema),
		defaultValues: {
			password: "",
		},
	});

	// Fetch user profile data
	useEffect(() => {
		const fetchProfileData = async () => {
			if (!user) return;

			try {
				const userDocRef = doc(db, "users", user.uid);
				const userDoc = await getDoc(userDocRef);

				if (userDoc.exists()) {
					const userData = userDoc.data();
					setProfileData(userData);

					// Update form with fetched data
					profileForm.reset({
						displayName: user.displayName || "",
						email: user.email || "",
						bio: userData.bio || "",
						website: userData.website || "",
						location: userData.location || "",
					});
				} else {
					// If user document doesn't exist, create it with default values
					const defaultData = {
						displayName: user.displayName,
						email: user.email,
						photoURL: user.photoURL,
						bio: "",
						website: "",
						location: "",
						createdAt: new Date(),
					};
					setProfileData(defaultData);
					profileForm.reset({
						displayName: user.displayName || "",
						email: user.email || "",
						bio: "",
						website: "",
						location: "",
					});
				}
			} catch (error) {
				console.error("Error fetching profile data:", error);
				toast.error("Failed to load profile data");
			} finally {
				setIsLoadingProfile(false);
			}
		};

		fetchProfileData();
	}, [user, profileForm]);

	// Handle profile form submission
	const onProfileSubmit = async (data: ProfileFormValues) => {
		if (!user) return;

		setIsLoading(true);
		try {
			// Update Firebase Auth profile
			if (data.displayName !== user.displayName) {
				await updateProfile(user, {
					displayName: data.displayName,
				});
			}

			// Update email if changed
			if (data.email !== user.email) {
				setIsEmailVerificationOpen(true);
				setIsLoading(false);
				return;
			}

			// Update Firestore document
			const userDocRef = doc(db, "users", user.uid);
			await updateDoc(userDocRef, {
				displayName: data.displayName,
				bio: data.bio || "",
				website: data.website || "",
				location: data.location || "",
				updatedAt: new Date(),
			});

			toast.success("Profile updated successfully");
		} catch (error: TAny) {
			console.error("Error updating profile:", error);
			toast.error(error.message || "Failed to update profile");
		} finally {
			setIsLoading(false);
		}
	};

	// Handle password form submission
	const onPasswordSubmit = async (data: PasswordFormValues) => {
		if (!user || !user.email) return;

		setIsLoading(true);
		try {
			// Re-authenticate user
			const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
			await reauthenticateWithCredential(user, credential);

			// Update password
			await updatePassword(user, data.newPassword);

			// Reset form
			passwordForm.reset({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});

			toast.success("Password updated successfully");
		} catch (error: TAny) {
			console.error("Error updating password:", error);
			if (error.code === "auth/wrong-password") {
				toast.error("Current password is incorrect");
			} else {
				toast.error(error.message || "Failed to update password");
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Handle email verification form submission
	const onEmailVerificationSubmit = async (data: EmailVerificationFormValues) => {
		if (!user || !user.email) return;

		setIsLoading(true);
		try {
			// Re-authenticate user
			const credential = EmailAuthProvider.credential(user.email, data.password);
			await reauthenticateWithCredential(user, credential);

			// Update email
			const newEmail = profileForm.getValues("email");
			await updateEmail(user, newEmail);

			// Update Firestore document
			const userDocRef = doc(db, "users", user.uid);
			await updateDoc(userDocRef, {
				email: newEmail,
				updatedAt: new Date(),
			});

			// Close dialog and reset form
			setIsEmailVerificationOpen(false);
			emailVerificationForm.reset();

			toast.success("Email updated successfully");
		} catch (error: TAny) {
			console.error("Error updating email:", error);
			if (error.code === "auth/wrong-password") {
				toast.error("Password is incorrect");
			} else if (error.code === "auth/email-already-in-use") {
				toast.error("Email is already in use by another account");
			} else {
				toast.error(error.message || "Failed to update email");
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Handle file input change with validation
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) return;

		const file = e.target.files[0];

		// Validate file type
		const allowedTypes = ["image/jpeg", "image/png"];
		if (!allowedTypes.includes(file.type)) {
			toast.error("Please select a valid image file (JPEG or PNG)");
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			return;
		}

		// Validate file size (5MB max)
		const MAX_FILE_SIZE = 5 * 1024 * 1024;
		if (file.size > MAX_FILE_SIZE) {
			toast.error("Image size should not exceed 5MB");
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			return;
		}

		setSelectedImageFile(file);
		setIsCropperOpen(true);
	};

	// Handle cropped image
	const handleCroppedImage = async (croppedBlob: Blob) => {
		if (!user) {
			toast.error("User not authenticated");
			return;
		}

		setIsUploadingImage(true);

		try {
			// Validate blob
			if (!croppedBlob || croppedBlob.size === 0) {
				throw new Error("Invalid image data");
			}

			// Create a File from the Blob with size validation
			const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
			if (croppedBlob.size > MAX_FILE_SIZE) {
				throw new Error("Image size exceeds 5MB limit");
			}

			// Create a File from the Blob
			const croppedFile = new File([croppedBlob], `profile-${Date.now()}.jpg`, {
				type: "image/jpeg",
			});

			// Upload image to Firebase Storage with retry logic
			const storageRef = ref(storage, `profile-images/${user.uid}`);
			let uploadRetries = 3;
			let uploadSuccess = false;
			let downloadURL = "";

			while (uploadRetries > 0 && !uploadSuccess) {
				try {
					await uploadBytes(storageRef, croppedFile);
					downloadURL = await getDownloadURL(storageRef);
					uploadSuccess = true;
				} catch (uploadError) {
					uploadRetries--;
					if (uploadRetries === 0) throw uploadError;
					await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before retry
				}
			}

			if (!downloadURL) {
				throw new Error("Failed to get download URL");
			}

			// Update user profile and Firestore document atomically
			await Promise.all([
				updateProfile(user, {
					photoURL: downloadURL,
				}),
				updateDoc(doc(db, "users", user.uid), {
					photoURL: downloadURL,
					updatedAt: new Date(),
				}),
			]);

			// Clear file input and close cropper
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			setIsCropperOpen(false);

			toast.success("Profile picture updated successfully");
		} catch (error) {
			console.error("Error uploading image:", error);
			toast.error(error instanceof Error ? error.message : "Failed to update profile picture");

			// Cleanup on error
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			setIsCropperOpen(false);
		} finally {
			setIsUploadingImage(false);
			setSelectedImageFile(null);
		}
	};

	// Trigger file input click
	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	if (!user) {
		return null;
	}

	return (
		<CmsLayout>
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Profile</h1>
					<p className="text-muted-foreground">Manage your account settings and preferences</p>
				</div>

				<Tabs defaultValue="general" className="space-y-6">
					<TabsList className="bg-muted/50">
						<TabsTrigger value="general" className="data-[state=active]:bg-background">
							<User className="h-4 w-4 mr-2" />
							General
						</TabsTrigger>
						<TabsTrigger value="security" className="data-[state=active]:bg-background">
							<Shield className="h-4 w-4 mr-2" />
							Security
						</TabsTrigger>
					</TabsList>

					<TabsContent value="general" className="space-y-6">
						{/* Profile Picture */}
						<Card>
							<CardHeader>
								<CardTitle>Profile Picture</CardTitle>
								<CardDescription>
									Update your profile picture. This will be displayed on your profile and in
									comments.
								</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col sm:flex-row items-center gap-6">
								<div className="relative">
									<Avatar className="h-24 w-24 border-2 border-border">
										<AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
										<AvatarFallback className="text-2xl">
											{user.displayName?.[0] || user.email?.[0] || "U"}
										</AvatarFallback>
									</Avatar>
									<div
										className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-primary text-primary-foreground cursor-pointer"
										onClick={triggerFileInput}
									>
										{isUploadingImage ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<Camera className="h-4 w-4" />
										)}
									</div>
									<input
										type="file"
										ref={fileInputRef}
										className="hidden"
										accept="image/jpeg, image/png"
										onChange={handleFileChange}
										disabled={isUploadingImage}
									/>
								</div>
								<div className="text-center sm:text-left">
									<h3 className="font-medium">{user.displayName || "User"}</h3>
									<p className="text-sm text-muted-foreground">{user.email}</p>
									<Button
										variant="outline"
										size="sm"
										className="mt-2"
										onClick={triggerFileInput}
										disabled={isUploadingImage}
									>
										{isUploadingImage ? (
											<>
												<Loader2 className="h-4 w-4 mr-2 animate-spin" />
												Uploading...
											</>
										) : (
											<>
												<Camera className="h-4 w-4 mr-2" />
												Change Picture
											</>
										)}
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Profile Information */}
						<Card>
							<CardHeader>
								<CardTitle>Profile Information</CardTitle>
								<CardDescription>
									Update your profile information. This information will be displayed publicly.
								</CardDescription>
							</CardHeader>
							<CardContent>
								{isLoadingProfile ? (
									<div className="flex justify-center py-6">
										<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
									</div>
								) : (
									<Form {...profileForm}>
										<form
											onSubmit={profileForm.handleSubmit(onProfileSubmit)}
											className="space-y-6"
										>
											<FormField
												control={profileForm.control}
												name="displayName"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Name</FormLabel>
														<FormControl>
															<Input placeholder="Your name" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={profileForm.control}
												name="email"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Email</FormLabel>
														<FormControl>
															<Input placeholder="Your email" type="email" {...field} />
														</FormControl>
														<FormDescription>
															Changing your email will require verification.
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={profileForm.control}
												name="bio"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Bio</FormLabel>
														<FormControl>
															<Textarea
																placeholder="Tell us a little about yourself"
																className="resize-none"
																{...field}
															/>
														</FormControl>
														<FormDescription>
															Brief description for your profile. URLs are hyperlinked.
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<FormField
													control={profileForm.control}
													name="website"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Website</FormLabel>
															<FormControl>
																<Input placeholder="https://example.com" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={profileForm.control}
													name="location"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Location</FormLabel>
															<FormControl>
																<Input placeholder="City, Country" {...field} />
															</FormControl>
															<FormMessage />
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

					<TabsContent value="security" className="space-y-6">
						{/* Account Security */}
						{/* <Card>
							<CardHeader>
								<CardTitle>Account Security</CardTitle>
								<CardDescription>
									Manage your account security settings and password.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div>
											<h3 className="font-medium">Email Verification</h3>
											<p className="text-sm text-muted-foreground">
												Verify your email address to secure your account.
											</p>
										</div>
										<div>
											{user.emailVerified ? (
												<Badge className="bg-green-500">
													<Check className="h-3.5 w-3.5 mr-1" />
													Verified
												</Badge>
											) : (
												<Button variant="outline" size="sm">
													Verify Email
												</Button>
											)}
										</div>
									</div>

									<Separator />

									<div className="flex items-center justify-between">
										<div>
											<h3 className="font-medium">Two-Factor Authentication</h3>
											<p className="text-sm text-muted-foreground">
												Add an extra layer of security to your account.
											</p>
										</div>
										<div>
											<Button variant="outline" size="sm" disabled>
												Coming Soon
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card> */}

						{/* Change Password */}
						<Card>
							<CardHeader>
								<CardTitle>Change Password</CardTitle>
								<CardDescription>Update your password to keep your account secure.</CardDescription>
							</CardHeader>
							<CardContent>
								<Form {...passwordForm}>
									<form
										onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
										className="space-y-6"
									>
										<Alert variant="default" className="bg-muted/50">
											<Info className="h-4 w-4" />
											<AlertTitle>Password requirements</AlertTitle>
											<AlertDescription>
												Your password must be at least 6 characters long.
											</AlertDescription>
										</Alert>

										<FormField
											control={passwordForm.control}
											name="currentPassword"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Current Password</FormLabel>
													<FormControl>
														<Input placeholder="••••••••" type="password" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={passwordForm.control}
											name="newPassword"
											render={({ field }) => (
												<FormItem>
													<FormLabel>New Password</FormLabel>
													<FormControl>
														<Input placeholder="••••••••" type="password" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={passwordForm.control}
											name="confirmPassword"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Confirm New Password</FormLabel>
													<FormControl>
														<Input placeholder="••••••••" type="password" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<Button type="submit" disabled={isLoading}>
											{isLoading ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													Updating...
												</>
											) : (
												<>
													<Key className="mr-2 h-4 w-4" />
													Update Password
												</>
											)}
										</Button>
									</form>
								</Form>
							</CardContent>
						</Card>

						{/* Danger Zone */}
						<Card className="border-destructive/50">
							<CardHeader>
								<CardTitle className="text-destructive">Danger Zone</CardTitle>
								<CardDescription>
									Irreversible and destructive actions for your account.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<h3 className="font-medium">Delete Account</h3>
										<p className="text-sm text-muted-foreground">
											Permanently delete your account and all of your content.
										</p>
									</div>
									<div>
										<Dialog>
											<DialogTrigger asChild>
												<Button variant="destructive" size="sm">
													Delete Account
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Are you absolutely sure?</DialogTitle>
													<DialogDescription>
														This action cannot be undone. This will permanently delete your account
														and remove your data from our servers.
													</DialogDescription>
												</DialogHeader>
												<div className="space-y-4 py-4">
													<Alert variant="destructive">
														<AlertCircle className="h-4 w-4" />
														<AlertTitle>Warning</AlertTitle>
														<AlertDescription>
															All of your data will be permanently deleted. This action cannot be
															undone.
														</AlertDescription>
													</Alert>
													<div className="flex items-center space-x-2">
														<Input placeholder="Type 'delete' to confirm" className="flex-1" />
													</div>
												</div>
												<DialogFooter>
													<Button variant="outline">Cancel</Button>
													<Button variant="destructive">Delete Account</Button>
												</DialogFooter>
											</DialogContent>
										</Dialog>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>

			{/* Image Cropper Dialog */}
			<ImageCropper
				imageFile={selectedImageFile}
				open={isCropperOpen}
				onClose={() => setIsCropperOpen(false)}
				onCropComplete={handleCroppedImage}
			/>

			{/* Email Verification Dialog */}
			<Dialog open={isEmailVerificationOpen} onOpenChange={setIsEmailVerificationOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Verify Your Identity</DialogTitle>
						<DialogDescription>
							Please enter your current password to verify your identity and update your email
							address.
						</DialogDescription>
					</DialogHeader>
					<Form {...emailVerificationForm}>
						<form
							onSubmit={emailVerificationForm.handleSubmit(onEmailVerificationSubmit)}
							className="space-y-4"
						>
							<FormField
								control={emailVerificationForm.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Current Password</FormLabel>
										<FormControl>
											<Input placeholder="••••••••" type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsEmailVerificationOpen(false)}
									disabled={isLoading}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isLoading}>
									{isLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Verifying...
										</>
									) : (
										<>
											<Mail className="mr-2 h-4 w-4" />
											Update Email
										</>
									)}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</CmsLayout>
	);
};

export default CmsProfile;
