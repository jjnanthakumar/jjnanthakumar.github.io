import { MY_USER_ID } from "@/constants/app";
import { auth } from "@/lib/firebase";
import {
	User,
	UserCredential,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	error: Error | null;
	signIn: (email: string, password: string) => Promise<UserCredential>;
	signOut: () => Promise<void>;
	resetError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user && user.uid !== MY_USER_ID) {
				// If signed in user is not the admin, sign them out
				signOut(auth).catch(console.error);
				setUser(null);
			} else {
				setUser(user);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const signIn = async (email: string, password: string): Promise<UserCredential> => {
		try {
			setError(null);
			setLoading(true);
			const res = await signInWithEmailAndPassword(auth, email, password);
			return res;
		} catch (err) {
			setError(err instanceof Error ? err : new Error("An error occurred"));
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const handleSignOut = async () => {
		try {
			setError(null);
			setLoading(true);
			await signOut(auth);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("An error occurred"));
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const resetError = () => setError(null);

	const value = {
		user,
		loading,
		error,
		signIn,
		signOut: handleSignOut,
		resetError,
	};

	return (
		<AuthContext.Provider
			value={{
				...value,
				signIn: async (email, password) => {
					return await value.signIn(email, password);
				},
			}}
		>
			{!loading && children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
