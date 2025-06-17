import { APP_CONFIG } from "@/constants/app";
import { createContext, useContext, useEffect, useState } from "react";

type ColorScheme = "blue" | "purple" | "green" | "orange" | "red";
type Theme = "light" | "dark" | "system";

interface ThemeContextType {
	theme: Theme;
	colorScheme: ColorScheme;
	setTheme: (theme: Theme) => void;
	setColorScheme: (scheme: ColorScheme) => void;
	isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const [theme, setThemeState] = useState<Theme>(() => {
		const stored = localStorage.getItem("theme") as Theme;
		return stored || APP_CONFIG.DEFAULT_THEME;
	});

	const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
		const stored = localStorage.getItem("colorScheme") as ColorScheme;
		return stored || "blue";
	});

	const [isDark, setIsDark] = useState(false);

	const setTheme = (newTheme: Theme) => {
		setThemeState(newTheme);
		localStorage.setItem("theme", newTheme);
	};

	useEffect(() => {
		const root = window.document.documentElement;
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const updateTheme = () => {
			const isDarkMode = theme === "dark" || (theme === "system" && mediaQuery.matches);

			root.classList.remove("light", "dark");
			root.classList.add(isDarkMode ? "dark" : "light");
			root.setAttribute("data-color-scheme", colorScheme);
			setIsDark(isDarkMode);
		};

		updateTheme();
		mediaQuery.addEventListener("change", updateTheme);
		return () => mediaQuery.removeEventListener("change", updateTheme);
	}, [theme, colorScheme]);

	return (
		<ThemeContext.Provider
			value={{
				theme,
				colorScheme,
				setTheme,
				setColorScheme,
				isDark,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = (): ThemeContextType => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
