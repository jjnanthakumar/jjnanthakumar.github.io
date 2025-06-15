import { APP_CONFIG, META_DEFAULTS } from "@/constants/app";
import { Helmet, HelmetProvider } from "react-helmet-async";

interface SEOProps {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
	type?: "website" | "article";
	publishedTime?: string;
	modifiedTime?: string;
	author?: string;
	noindex?: boolean;
	nofollow?: boolean;
	canonicalUrl?: string;
}

export function SEO({
	title,
	description = APP_CONFIG.SITE_DESCRIPTION,
	image = META_DEFAULTS.OG_IMAGE,
	url = APP_CONFIG.SITE_URL,
	type = "website",
	publishedTime,
	modifiedTime,
	author,
	noindex = false,
	nofollow = false,
	canonicalUrl,
}: SEOProps) {
	const siteTitle = title ? `${title} | ${APP_CONFIG.SITE_NAME}` : APP_CONFIG.SITE_NAME;

	const robots = [noindex ? "noindex" : "index", nofollow ? "nofollow" : "follow"].join(", ");

	return (
		<HelmetProvider>
			<Helmet>
				<title>{siteTitle}</title>
				<meta name="description" content={description} />
				<meta name="robots" content={robots} />

				{/* Open Graph */}
				<meta property="og:title" content={siteTitle} />
				<meta property="og:description" content={description} />
				<meta property="og:image" content={image} />
				<meta property="og:url" content={url} />
				<meta property="og:type" content={type} />
				<meta property="og:site_name" content={APP_CONFIG.SITE_NAME} />

				{/* Twitter */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content={META_DEFAULTS.TWITTER_HANDLE} />
				<meta name="twitter:title" content={siteTitle} />
				<meta name="twitter:description" content={description} />
				<meta name="twitter:image" content={image} />

				{/* Article specific */}
				{publishedTime && <meta property="article:published_time" content={publishedTime} />}
				{modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
				{author && <meta property="article:author" content={author} />}

				{/* Canonical URL */}
				{canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
			</Helmet>
		</HelmetProvider>
	);
}
