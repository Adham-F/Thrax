import { Helmet } from "react-helmet";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default function TermsOfServicePage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | THRAX</title>
        <meta name="description" content="THRAX Terms of Service - The rules and guidelines for using our website and services." />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        
        <main className="flex-1 container max-w-4xl py-10 px-4 md:px-6 mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground">Last Updated: May 16, 2023</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the THRAX website, you agree to be bound by these Terms of Service. If you do not agree 
              to all of these terms, you may not use our services.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Your continued use of our website following the posting 
              of changes constitutes your acceptance of such changes.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate and complete information. You are responsible for 
              maintaining the confidentiality of your account and password and for restricting access to your computer. You agree 
              to accept responsibility for all activities that occur under your account.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Products and Purchases</h2>
            <p>We sell various products on our website. By placing an order, you agree to the following:</p>
            <ul className="list-disc pl-6 my-4">
              <li>You are authorized to use the payment method provided</li>
              <li>We reserve the right to refuse or cancel orders for any reason</li>
              <li>Prices and availability of products are subject to change without notice</li>
              <li>We make every effort to display products accurately, but cannot guarantee that colors and other details will be accurate</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Shipping and Returns</h2>
            <p>
              Products will be shipped to the address you provide when placing your order. Please review our 
              Shipping & Returns Policy for more details about shipping times, costs, and return procedures.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">6. Intellectual Property</h2>
            <p>
              All content on our website, including text, graphics, logos, images, product designs, and software, 
              is the property of THRAX and is protected by intellectual property laws. You may not use, reproduce, 
              distribute, or create derivative works from this content without our express written permission.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">7. User Content</h2>
            <p>
              By posting reviews, comments, or other content on our website, you grant us a non-exclusive, royalty-free, 
              perpetual, irrevocable right to use, reproduce, modify, publish, and distribute such content.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
            <p>
              THRAX shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages 
              resulting from your use or inability to use our services or products.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">9. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in 
              which our company is registered, without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at:
              <br />
              <a href="mailto:legal@thrax.com" className="text-primary hover:underline">legal@thrax.com</a>
            </p>
          </div>
        </main>
        
        <SiteFooter />
      </div>
    </>
  );
}