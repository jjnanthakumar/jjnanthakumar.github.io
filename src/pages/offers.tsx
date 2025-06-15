import { SEO } from "@/components/common/seo";
import { ContactCTA } from "@/components/offers/contact-cta";
import { OfferCard } from "@/components/offers/offer-card";
import { SectionHeader } from "@/components/ui/section-header";
import { offers } from "@/data/offers";

const OffersPage = () => {
	return (
		<>
			<SEO
				title="Service Offers"
				description="Professional web development services with clear pricing and deliverables. From landing pages to complex web applications."
			/>

			<div className="container px-4 py-12 md:py-20 max-w-6xl mx-auto">
				<SectionHeader
					title="My Services"
					subtitle="What I Offer"
					description="Here are the services I provide with transparent pricing and clear deliverables. Each package is designed to meet specific needs and can be customized to fit your project requirements."
					align="center"
					className="mb-12"
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
					{offers.map((offer) => (
						<OfferCard key={offer.id} offer={offer} />
					))}
				</div>

				<ContactCTA />
			</div>
		</>
	);
};

export default OffersPage;
