import { Helmet } from "react-helmet";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default function CookiePolicyPage() {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | THRAX</title>
        <meta name="description" content="THRAX Cookie Policy - Learn how we use cookies and similar technologies on our website." />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        
        <main className="flex-1 container max-w-4xl py-10 px-4 md:px-6 mx-auto">
          <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground">Last Updated: May 16, 2023</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make 
              websites work more efficiently and provide information to the website owners.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Cookies</h2>
            <p>We use cookies for several purposes, including:</p>
            <ul className="list-disc pl-6 my-4">
              <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
              <li><strong>Functionality cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Analytical cookies:</strong> Help us understand how visitors interact with our website</li>
              <li><strong>Performance cookies:</strong> Improve the speed and performance of the website</li>
              <li><strong>Advertising cookies:</strong> Deliver more relevant advertisements and track the effectiveness of advertising campaigns</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. Types of Cookies We Use</h2>
            <p>
              <strong>Session Cookies:</strong> These are temporary cookies that are deleted when you close your browser. They help us 
              track your movements from page to page so you don't have to provide the same information repeatedly.
            </p>
            <p>
              <strong>Persistent Cookies:</strong> These remain on your device after you close your browser until they expire or you delete them. 
              They help us remember your preferences for the next time you visit.
            </p>
            <p>
              <strong>First-Party Cookies:</strong> These are cookies set by our website.
            </p>
            <p>
              <strong>Third-Party Cookies:</strong> These are cookies set by our partners and service providers, such as Google Analytics 
              and advertising networks.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings. You can typically find these settings in the "options" 
              or "preferences" menu of your browser. You can:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Delete all cookies</li>
              <li>Block all cookies</li>
              <li>Allow all cookies</li>
              <li>Block third-party cookies</li>
              <li>Clear cookies when you close your browser</li>
            </ul>
            <p>
              Please note that blocking or deleting cookies may impact your experience on our website, as some features may not function properly.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Changes to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. The updated version will be indicated by an updated "Last Updated" date 
              and the updated version will be effective as soon as it is accessible.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">6. Contact Us</h2>
            <p>
              If you have questions or comments about this Cookie Policy, please contact us at:
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