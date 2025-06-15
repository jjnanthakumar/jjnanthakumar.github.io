import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router";

const TermsOfService = () => {
	return (
		<div className="container max-w-4xl mx-auto py-16 px-4">
			<div className="flex items-center gap-2 mb-8">
				<Button variant="ghost" size="sm" asChild className="rounded-full">
					<Link to="/" className="flex items-center gap-2">
						<ArrowLeft size={16} />
						Back to Home
					</Link>
				</Button>
			</div>

			<div className="bg-background border border-border/40 rounded-xl p-8 shadow-md">
				<div className="flex items-center gap-3 mb-6">
					<div className="p-3 bg-primary/10 rounded-xl text-primary">
						<FileText size={24} />
					</div>
					<h1 className="text-3xl font-bold">Terms of Service</h1>
				</div>

				<div className="prose prose-lg max-w-none">
					<p className="text-muted-foreground">Last updated: April 8, 2024</p>

					<h2>1. Introduction</h2>
					<p>
						Welcome to Nanthakumar's professional services. These Terms of Service ("Terms") govern
						your use of our website, services, and any other related services (collectively, the
						"Services") provided by Nanthakumar ("we," "us," or "our").
					</p>
					<p>
						By accessing or using our Services, you agree to be bound by these Terms. If you do not
						agree to these Terms, please do not use our Services.
					</p>

					<h2>2. Services Description</h2>
					<p>
						We provide professional web development services including but not limited to frontend
						development, UI/UX implementation, performance optimization, API integration, web
						animation, and technical leadership. The specific details of the services to be provided
						will be outlined in a separate agreement or statement of work between you and us.
					</p>

					<h2>3. Service Request and Delivery</h2>
					<p>
						3.1. <strong>Service Requests</strong>: You may request our services through our website
						contact form, email, or other designated channels. All requests are subject to our
						review and acceptance.
					</p>
					<p>
						3.2. <strong>Project Scope</strong>: The scope of work, deliverables, timeline, and
						payment terms will be agreed upon in writing before the commencement of any project.
					</p>
					<p>
						3.3. <strong>Revisions</strong>: Unless otherwise specified in the project agreement,
						reasonable revisions are included in the project scope. Additional revisions may incur
						extra charges.
					</p>
					<p>
						3.4. <strong>Delivery</strong>: We will make reasonable efforts to deliver the services
						within the agreed timeframe. However, we are not responsible for delays caused by
						factors beyond our control or by your failure to provide necessary information or
						materials.
					</p>

					<h2>4. Client Responsibilities</h2>
					<p>
						4.1. <strong>Cooperation</strong>: You agree to provide timely and accurate information,
						materials, and feedback necessary for us to perform the services.
					</p>
					<p>
						4.2. <strong>Content</strong>: You are responsible for the accuracy, legality, and
						ownership of all content and materials you provide to us.
					</p>
					<p>
						4.3. <strong>Approvals</strong>: You are responsible for reviewing and approving
						deliverables in a timely manner.
					</p>

					<h2>5. Fees and Payment</h2>
					<p>
						5.1. <strong>Fees</strong>: Our fees will be as specified in the project agreement. We
						reserve the right to change our fees for future services.
					</p>
					<p>
						5.2. <strong>Payment Terms</strong>: Unless otherwise specified, we require a 50%
						deposit before commencing work, with the remaining balance due upon completion. For
						larger projects, we may establish a milestone-based payment schedule.
					</p>
					<p>
						5.3. <strong>Late Payments</strong>: Late payments may incur interest charges and may
						result in suspension of services.
					</p>

					<h2>6. Intellectual Property</h2>
					<p>
						6.1. <strong>Your Content</strong>: You retain ownership of all content and materials
						you provide to us.
					</p>
					<p>
						6.2. <strong>Our Work</strong>: Upon full payment, you will receive a non-exclusive
						license to use the deliverables for the intended purpose. We retain ownership of all
						pre-existing materials, tools, and methodologies used in creating the deliverables.
					</p>
					<p>
						6.3. <strong>Portfolio Rights</strong>: Unless explicitly prohibited in writing, we
						reserve the right to display and link to your completed project as part of our portfolio
						and to write about the project for promotional purposes.
					</p>

					<h2>7. Confidentiality</h2>
					<p>
						We will maintain the confidentiality of any proprietary information shared with us
						during the course of providing services. This obligation does not apply to information
						that is publicly available or that we obtained from other sources.
					</p>

					<h2>8. Limitation of Liability</h2>
					<p>
						8.1. <strong>No Warranties</strong>: Our services are provided "as is" without any
						warranties, express or implied.
					</p>
					<p>
						8.2. <strong>Limitation of Liability</strong>: To the maximum extent permitted by law,
						we shall not be liable for any indirect, incidental, special, consequential, or punitive
						damages, or any loss of profits or revenues, whether incurred directly or indirectly.
					</p>
					<p>
						8.3. <strong>Maximum Liability</strong>: Our total liability for any claim arising out
						of or relating to these Terms or our services shall not exceed the amount you paid us
						for the services giving rise to the claim.
					</p>

					<h2>9. Termination</h2>
					<p>
						9.1. <strong>By You</strong>: You may terminate a project at any time by providing
						written notice. You will be responsible for payment for all services performed up to the
						date of termination.
					</p>
					<p>
						9.2. <strong>By Us</strong>: We may terminate a project if you breach these Terms or the
						project agreement, or if we are unable to perform the services due to circumstances
						beyond our control.
					</p>

					<h2>10. Governing Law</h2>
					<p>
						These Terms shall be governed by and construed in accordance with the laws of Indonesia,
						without regard to its conflict of law principles.
					</p>

					<h2>11. Dispute Resolution</h2>
					<p>
						Any dispute arising out of or relating to these Terms or our services shall be resolved
						through good faith negotiations. If negotiations fail, the dispute shall be submitted to
						binding arbitration in accordance with the rules of the Indonesian National Board of
						Arbitration.
					</p>

					<h2>12. Changes to Terms</h2>
					<p>
						We reserve the right to modify these Terms at any time. We will provide notice of
						significant changes by posting the updated Terms on our website. Your continued use of
						our Services after such changes constitutes your acceptance of the new Terms.
					</p>

					<h2>13. Contact Information</h2>
					<p>
						If you have any questions about these Terms, please contact us at{" "}
						<a href="mailto:jjnanthakumar477@gmail.com" className="text-primary hover:underline">
							jjnanthakumar477@gmail.com
						</a>
						.
					</p>
				</div>
			</div>
		</div>
	);
};

export default TermsOfService;
