import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import path from "path";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current working directory.
	const env = loadEnv(mode, process.cwd());
	const isProduction = mode === "production";

	return {
		base: "/me",
		plugins: [react(), componentTagger()],
		server: {
			port: 8080,
			hmr: {
				overlay: true,
			},
		},
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		optimizeDeps: {
			include: ["@mdx-js/*", "rehype-*", "remark-*"],
		},
		build: {
			target: "es2020",
			sourcemap: !isProduction,
			minify: isProduction ? "esbuild" : false,
			rollupOptions: {
				external: ["esbuild"],
				output: {
					manualChunks: {
						vendor: ["react", "react-dom", "react-router"],
						firebase: ["firebase/app", "firebase/firestore", "firebase/auth"],
						cms: [
							"@/pages/cms/dashboard",
							"@/pages/cms/projects/form-project",
						],
						charts: ["recharts"],
						mdx: ["@mdx-js/react", "@mdx-js/mdx"],
					},
				},
			},
			chunkSizeWarningLimit: 900,
		},
	};
});
