import { useState } from "react";
import { Helmet } from "react-helmet";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// FAQ categories and questions
const faqData = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How can I track my order?",
        a: "Once your order has shipped, you'll receive a confirmation email with a tracking number. You can also check your order status on your account page or visit our 'Track Order' page in the Help section."
      },
      {
        q: "What shipping methods do you offer?",
        a: "We offer standard shipping (3-7 business days), express shipping (2-3 business days), and overnight shipping (1 business day, order before 2 PM). Shipping options and costs will be displayed during checkout."
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to most countries worldwide. International shipping times typically range from 7-14 business days depending on the destination country. Customs fees and import duties may apply and are the responsibility of the recipient."
      },
      {
        q: "Can I change my shipping address after placing an order?",
        a: "If you need to change your shipping address, please contact us immediately at support@thrax.com. We can only change the address if the order hasn't been processed for shipping yet."
      }
    ]
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return policy for most items. Products must be in original condition with tags attached and original packaging. Some items like underwear, swimwear, and face masks cannot be returned for hygiene reasons."
      },
      {
        q: "How do I start a return?",
        a: "To start a return, log into your account, go to your orders, select the order containing the item(s) you want to return, and follow the return instructions. You can also visit our Returns page in the Help section."
      },
      {
        q: "How long does it take to process a refund?",
        a: "Once we receive and inspect your return (usually 1-3 business days after receipt), we'll process your refund. It may take an additional 5-10 business days for the refund to appear in your account, depending on your payment method."
      },
      {
        q: "Do I have to pay for return shipping?",
        a: "Customers are responsible for return shipping costs unless the item arrived damaged, defective, or if we sent you the wrong item. In these cases, we'll provide a prepaid return label."
      }
    ]
  },
  {
    category: "Products & Sizing",
    questions: [
      {
        q: "How do I find my size?",
        a: "We provide detailed size guides for all our product categories. You can find them on individual product pages or in our comprehensive Size Guide in the Help section."
      },
      {
        q: "Are your products true to size?",
        a: "Our products generally run true to size, but we recommend checking the specific sizing notes on each product page. Some brands or styles may fit differently, and these differences will be noted in the product description."
      },
      {
        q: "Where are your products manufactured?",
        a: "Our products are manufactured in various locations around the world. We work with factories that adhere to ethical manufacturing practices and fair labor standards. Specific manufacturing information is provided on product pages when available."
      },
      {
        q: "Do you offer customization of products?",
        a: "Currently, we don't offer product customization, but we're always expanding our services. Sign up for our newsletter to stay updated on new features and offerings."
      }
    ]
  },
  {
    category: "Account & Payment",
    questions: [
      {
        q: "How do I create an account?",
        a: "You can create an account by clicking the 'Sign In' button at the top of our website and selecting 'Create Account'. You'll need to provide your email, create a username and password, and fill in some basic information."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay. All payments are securely processed through our payment processor."
      },
      {
        q: "Is my payment information secure?",
        a: "Yes, all payment information is encrypted and securely processed. We don't store your complete credit card information on our servers. We use industry-standard SSL encryption and comply with PCI DSS requirements."
      },
      {
        q: "How do I reset my password?",
        a: "Click on the 'Sign In' button, then select 'Forgot Password'. Enter your email address, and we'll send you instructions to reset your password. The reset link is valid for 24 hours."
      }
    ]
  },
  {
    category: "Other",
    questions: [
      {
        q: "How can I contact customer service?",
        a: "You can contact our customer service team through our Contact Us page, by emailing support@thrax.com, or by calling our customer service line at 1-800-THRAX-CS (Monday through Friday, 9 AM to 6 PM EST)."
      },
      {
        q: "Do you have physical stores?",
        a: "Currently, we operate exclusively online. This allows us to offer competitive prices and serve customers worldwide. We may open physical locations in the future."
      },
      {
        q: "How can I unsubscribe from emails?",
        a: "You can unsubscribe from our emails by clicking the 'Unsubscribe' link at the bottom of any email we send. You can also manage your email preferences in your account settings."
      },
      {
        q: "Are gift cards available?",
        a: "Yes, we offer digital gift cards in various denominations. Gift cards can be purchased on our website and sent directly to the recipient's email address with a personalized message."
      }
    ]
  }
];

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery.trim() === "" 
    ? faqData 
    : faqData.map(category => ({
        category: category.category,
        questions: category.questions.filter(
          q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
               q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0);

  // Expand all categories that have search results
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() !== "") {
      const newExpandedState: Record<string, boolean> = {};
      filteredFaqs.forEach(category => {
        newExpandedState[category.category] = true;
      });
      setExpandedCategories(newExpandedState);
    }
  };

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | THRAX</title>
        <meta name="description" content="Find answers to common questions about orders, shipping, returns, products, and more." />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        
        <main className="flex-1 container max-w-4xl py-10 px-4 md:px-6 mx-auto">
          <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
          
          {/* Search */}
          <div className="relative mb-8">
            <div className="flex">
              <Input
                className="w-full pr-10"
                placeholder="Search for a question..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Button variant="ghost" className="absolute right-0" tabIndex={-1}>
                <Search className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>
          
          {/* FAQs */}
          <div className="space-y-6">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg text-muted-foreground">No questions found matching "{searchQuery}"</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              filteredFaqs.map((category, categoryIndex) => (
                <div key={categoryIndex} className="border rounded-lg overflow-hidden">
                  <div 
                    className="bg-muted/50 px-4 py-3 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleCategory(category.category)}
                  >
                    <h2 className="text-lg font-semibold">{category.category}</h2>
                    <span className="text-sm text-muted-foreground">{category.questions.length} questions</span>
                  </div>
                  
                  {(expandedCategories[category.category] || searchQuery.trim() !== "") && (
                    <Accordion type="multiple" className="px-4 py-2">
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                          <AccordionTrigger className="text-left">
                            {faq.q}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground">{faq.a}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              ))
            )}
          </div>
          
          {/* Still need help section */}
          <div className="mt-12 bg-muted/30 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
            <p className="text-muted-foreground mb-4">
              Our customer support team is here to help you with any questions or concerns.
            </p>
            <Button variant="default" asChild>
              <a href="/help/contact-us">Contact Us</a>
            </Button>
          </div>
        </main>
        
        <SiteFooter />
      </div>
    </>
  );
}