import { Helmet } from "react-helmet";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | THRAX</title>
        <meta name="description" content="THRAX Privacy Policy - How we collect, use, and protect your personal information." />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        
        <main className="flex-1 container max-w-4xl py-10 px-4 md:px-6 mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground">Last Updated: May 16, 2023</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to THRAX ("we," "our," or "us"). We are committed to protecting your privacy and personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              or make a purchase.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
            <p>We collect information that you provide directly to us, such as:</p>
            <ul className="list-disc pl-6 my-4">
              <li>Personal information (name, email address, shipping address, phone number)</li>
              <li>Payment information (processed securely through our payment processor)</li>
              <li>Order history and preferences</li>
              <li>Account information (username, password)</li>
              <li>Communications with us</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use your information for various purposes, including:</p>
            <ul className="list-disc pl-6 my-4">
              <li>Processing and fulfilling your orders</li>
              <li>Managing your account</li>
              <li>Communicating with you about your orders and our services</li>
              <li>Improving our website and services</li>
              <li>Sending marketing communications (if you've opted in)</li>
              <li>Complying with legal obligations</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Sharing of Information</h2>
            <p>
              We may share your information with third-party service providers who help us operate our business and website, 
              such as payment processors, shipping companies, and marketing services. We may also share information when required by law.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul className="list-disc pl-6 my-4">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your information</li>
              <li>Objection to certain processing</li>
              <li>Data portability</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">6. Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, 
              accidental loss, destruction, or damage.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">7. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date 
              and the updated version will be effective as soon as it is accessible.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">8. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:privacy@thrax.com" className="text-primary hover:underline">privacy@thrax.com</a>
            </p>
          </div>
        </main>
        
        <SiteFooter />
      </div>
    </>
  );
}