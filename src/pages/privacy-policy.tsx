import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router";

const PrivacyPolicy = () => {
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
            <Shield size={24} />
          </div>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground">Last updated: April 8, 2024</p>

          <h2>1. Introduction</h2>
          <p>
            At Nanthakumar ("we," "us," or "our"), we respect your privacy and
            are committed to protecting your personal data. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you visit our website or use our services.
          </p>
          <p>
            Please read this Privacy Policy carefully. If you do not agree with
            the terms of this Privacy Policy, please do not access our website
            or use our services.
          </p>

          <h2>2. Information We Collect</h2>
          <p>We may collect the following types of information:</p>

          <h3>2.1. Personal Information</h3>
          <p>
            When you contact us through our website, request our services, or
            communicate with us, we may collect personal information such as:
          </p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Company name (if applicable)</li>
            <li>Project details and requirements</li>
            <li>Any other information you choose to provide</li>
          </ul>

          <h3>2.2. Usage Information</h3>
          <p>
            We may automatically collect certain information about your device
            and how you interact with our website, including:
          </p>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Referring website</li>
            <li>Pages visited and time spent on those pages</li>
            <li>Time and date of your visit</li>
            <li>Other statistics</li>
          </ul>

          <h3>2.3. Cookies and Similar Technologies</h3>
          <p>
            We may use cookies, web beacons, and similar technologies to enhance
            your experience on our website. You can control cookies through your
            browser settings and other tools.
          </p>

          <h2>3. How We Use Your Information</h2>
          <p>
            We may use the information we collect for various purposes,
            including to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process and fulfill your service requests</li>
            <li>
              Communicate with you about your service requests, inquiries, or
              projects
            </li>
            <li>
              Send you technical notices, updates, security alerts, and
              administrative messages
            </li>
            <li>
              Respond to your comments, questions, and customer service requests
            </li>
            <li>
              Monitor and analyze trends, usage, and activities in connection
              with our website
            </li>
            <li>Detect, prevent, and address technical issues</li>
            <li>Protect against harmful, unauthorized, or illegal activity</li>
          </ul>

          <h2>4. How We Share Your Information</h2>
          <p>We may share your information in the following circumstances:</p>
          <ul>
            <li>
              <strong>Service Providers</strong>: We may share your information
              with third-party vendors, service providers, contractors, or
              agents who perform services for us or on our behalf.
            </li>
            <li>
              <strong>Legal Requirements</strong>: We may disclose your
              information if required to do so by law or in response to valid
              requests by public authorities.
            </li>
            <li>
              <strong>Business Transfers</strong>: We may share or transfer your
              information in connection with, or during negotiations of, any
              merger, sale of company assets, financing, or acquisition of all
              or a portion of our business.
            </li>
            <li>
              <strong>With Your Consent</strong>: We may share your information
              with your consent or at your direction.
            </li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information from unauthorized access,
            disclosure, alteration, and destruction. However, no method of
            transmission over the Internet or electronic storage is 100% secure,
            and we cannot guarantee absolute security.
          </p>

          <h2>6. Data Retention</h2>
          <p>
            We will retain your personal information only for as long as
            necessary to fulfill the purposes for which it was collected,
            including for the purposes of satisfying any legal, accounting, or
            reporting requirements.
          </p>

          <h2>7. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding
            your personal information, including:
          </p>
          <ul>
            <li>The right to access your personal information</li>
            <li>The right to rectify inaccurate or incomplete information</li>
            <li>The right to erasure (or "right to be forgotten")</li>
            <li>The right to restrict processing</li>
            <li>The right to data portability</li>
            <li>The right to object to processing</li>
            <li>The right to withdraw consent</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information
            provided in the "Contact Information" section below.
          </p>

          <h2>8. Children's Privacy</h2>
          <p>
            Our website and services are not intended for children under the age
            of 16. We do not knowingly collect personal information from
            children under 16. If you are a parent or guardian and believe that
            your child has provided us with personal information, please contact
            us, and we will delete such information from our records.
          </p>

          <h2>9. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites or services.
            We are not responsible for the privacy practices or content of these
            third-party sites. We encourage you to read the privacy policies of
            any third-party sites you visit.
          </p>

          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last updated" date. You are advised to review this
            Privacy Policy periodically for any changes.
          </p>

          <h2>11. Contact Information</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:{" "}
            <a
              href="mailto:jjnanthakumar477@gmail.com"
              className="text-primary hover:underline"
            >
              jjnanthakumar477@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
