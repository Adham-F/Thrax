import { useState } from "react";
import { Helmet } from "react-helmet";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function FAQsPage() {
  // Fetch the FAQs page content
  const { data: pageContent, isLoading } = useQuery({
    queryKey: ["/api/help-pages/faqs"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/help-pages/faqs");
        return await res.json();
      } catch (error) {
        // Return default if API fails
        return { content: "# Frequently Asked Questions\n\nFind answers to common questions." };
      }
    }
  });

  // FAQ categories and questions
  const faqCategories = [
    {
      title: "Ordering & Payment",
      items: [
        {
          question: "How do I place an order?",
          answer: "Browse our products, add items to your cart, and proceed to checkout. Follow the prompts to enter your shipping and payment information to complete your order."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All transactions are secured with industry-standard encryption."
        },
        {
          question: "Can I modify or cancel my order after it's been placed?",
          answer: "You can modify or cancel your order within 1 hour of placing it. Please contact our customer service team immediately at support@thrax.com with your order number."
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes, we use industry-standard SSL encryption to protect your payment information. We never store your full credit card details on our servers."
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      items: [
        {
          question: "How long will it take to receive my order?",
          answer: "Standard shipping takes 3-5 business days. Express shipping is 1-2 business days. International shipping typically takes 7-14 business days, depending on the destination."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location."
        },
        {
          question: "Is free shipping available?",
          answer: "We offer free standard shipping on all domestic orders over $75. International orders and expedited shipping options have additional fees."
        },
        {
          question: "How can I track my order?",
          answer: "Once your order ships, you'll receive a tracking number via email. You can also view your order status and tracking information in your account under 'Order History'."
        }
      ]
    },
    {
      title: "Returns & Refunds",
      items: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for most items. Products must be in original condition with tags attached and original packaging. Some items like earphones and undergarments cannot be returned for hygiene reasons."
        },
        {
          question: "How do I initiate a return?",
          answer: "Log into your account, go to 'Order History', select the order containing the item you wish to return, and follow the return instructions. You can also contact our customer service for assistance."
        },
        {
          question: "When will I receive my refund?",
          answer: "Once we receive and inspect your return (usually 3-5 business days), the refund will be processed to your original payment method. It may take an additional 5-10 business days for the refund to appear in your account, depending on your payment provider."
        },
        {
          question: "Do you offer exchanges?",
          answer: "Yes, you can exchange items for a different size or color if available. Initiate the exchange through your account or contact our customer service team."
        }
      ]
    },
    {
      title: "Products & Sizing",
      items: [
        {
          question: "How do I find the right size?",
          answer: "We provide detailed size guides for all our clothing and footwear. Check the size guide on the product page or visit our Size Guide in the Help section for comprehensive measurements."
        },
        {
          question: "Are your products authentic?",
          answer: "Yes, all our products are 100% authentic. We source directly from brands or authorized distributors and guarantee the authenticity of every item we sell."
        },
        {
          question: "What if an item I want is out of stock?",
          answer: "You can sign up for notifications on the product page to be alerted when the item is back in stock. Popular items are usually restocked within 2-4 weeks."
        }
      ]
    },
    {
      title: "Account & Technical Issues",
      items: [
        {
          question: "How do I create an account?",
          answer: "Click on the 'Account' icon in the top right corner of our website and select 'Sign Up'. Fill in your details to create your account. You can also check out as a guest if you prefer."
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer: "On the login page, click 'Forgot Password?' and enter your email address. You'll receive an email with instructions to reset your password."
        },
        {
          question: "Can I update my shipping address for an order?",
          answer: "You can update your shipping address if the order hasn't been processed yet. Contact our customer service immediately with your order number and the correct address."
        },
        {
          question: "The website isn't working properly. What should I do?",
          answer: "Try clearing your browser cache and cookies, or use a different browser. If the issue persists, please contact our technical support team at tech@thrax.com with details of the problem."
        }
      ]
    }
  ];
  
  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | THRAX</title>
        <meta name="description" content="Find answers to commonly asked questions about orders, shipping, returns, and more." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        
        <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
              <p className="text-muted-foreground mt-2">
                Find answers to common questions about our products and services.
              </p>
            </div>
            
            <div className="grid gap-6">
              {faqCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.items.map((item, itemIndex) => (
                        <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                          <AccordionTrigger className="text-left">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground">{item.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {!isLoading && pageContent && (
              <Card>
                <CardContent className="prose dark:prose-invert max-w-none py-6">
                  {/* In a real app, use a markdown renderer here */}
                  <pre className="whitespace-pre-wrap">{pageContent.content}</pre>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        
        <SiteFooter />
      </div>
    </>
  );
}