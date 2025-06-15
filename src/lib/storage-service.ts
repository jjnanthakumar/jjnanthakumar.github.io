type StorageKey = "theme" | "user-preferences" | "auth-token" | "language";

class StorageService {
	private prefix = "app";

	private getKey(key: StorageKey): string {
		return `${this.prefix}:${key}`;
	}

	set<T>(key: StorageKey, value: T): void {
		try {
			const serializedValue = JSON.stringify(value);
			localStorage.setItem(this.getKey(key), serializedValue);
		} catch (error) {
			console.error(`Error saving to localStorage:`, error);
		}
	}

	get<T>(key: StorageKey, defaultValue?: T): T | undefined {
		try {
			const item = localStorage.getItem(this.getKey(key));
			return item ? JSON.parse(item) : defaultValue;
		} catch (error) {
			console.error(`Error reading from localStorage:`, error);
			return defaultValue;
		}
	}

	remove(key: StorageKey): void {
		localStorage.removeItem(this.getKey(key));
	}

	clear(): void {
		Object.keys(localStorage)
			.filter((key) => key.startsWith(this.prefix))
			.forEach((key) => localStorage.removeItem(key));
	}

	// Utility method for handling objects
	update<T extends object>(key: StorageKey, updates: Partial<T>): void {
		const current = this.get<T>(key, {} as T);
		this.set(key, { ...current, ...updates });
	}
}

export const storageService = new StorageService();
