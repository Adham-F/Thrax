import { useState } from "react";
import AdminLayout from "@/components/admin/layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Save, FileText, Truck, LifeBuoy, Ruler, MessageSquare } from "lucide-react";

// These will be stored in the database, but for now we'll use hardcoded initial content
const defaultContent = {
  contactUs: `
# Contact Us

We're here to help! If you have any questions, concerns, or feedback, please don't hesitate to reach out to us.

## Customer Service Hours
Monday-Friday: 9am - 6pm ET
Saturday: 10am - 4pm ET
Sunday: Closed

## Contact Information
Email: support@thrax.com
Phone: (555) 123-4567
Address: 123 Fashion Street, Style City, SC 10001
  `,
  faqs: `
# Frequently Asked Questions

## Ordering & Payment
**How do I place an order?**
Browse our products, select your desired items, add them to your cart, and proceed to checkout.

**What payment methods do you accept?**
We accept all major credit cards, PayPal, and Apple Pay.

## Shipping & Delivery
**How long will it take to receive my order?**
Standard shipping takes 3-5 business days. Express shipping is 1-2 business days.

**Do you ship internationally?**
Yes, we ship to most countries worldwide. International shipping typically takes 7-14 business days.
  `,
  shipping: `
# Shipping & Returns

## Shipping Policy
All orders are processed within 1-2 business days after payment confirmation. You will receive a shipping confirmation email with tracking information once your order has been shipped.

### Shipping Rates
- Standard Shipping: $5.99 (3-5 business days)
- Express Shipping: $12.99 (1-2 business days)
- Free shipping on all orders over $75

## Return Policy
We offer a 30-day return policy for most items. To be eligible for a return, your item must be unused and in the same condition that you received it, with all original packaging and tags attached.
  `,
  trackOrder: `
# Track Your Order

To track your order, please enter your order number and the email address used for the purchase in the form below.

You can find your order number in the order confirmation email that was sent to you after completing your purchase.

If you have any issues tracking your order, please contact our customer service team at support@thrax.com or call us at (555) 123-4567.
  `,
  sizeGuide: `
# Size Guide

Finding the right size is essential for a perfect fit. Please refer to our detailed size charts below to help you select the best size for your purchase.

## Clothing Size Chart
| Size | Chest (inches) | Waist (inches) | Hips (inches) |
|------|----------------|---------------|---------------|
| XS   | 32-34          | 26-28         | 34-36         |
| S    | 35-37          | 29-31         | 37-39         |
| M    | 38-40          | 32-34         | 40-42         |
| L    | 41-43          | 35-37         | 43-45         |
| XL   | 44-46          | 38-40         | 46-48         |

## Shoe Size Chart
| US Size | EU Size | UK Size | Foot Length (inches) |
|---------|---------|---------|----------------------|
| 6       | 39      | 5.5     | 9.25                 |
| 7       | 40      | 6.5     | 9.5                  |
| 8       | 41      | 7.5     | 9.75                 |
| 9       | 42      | 8.5     | 10                   |
| 10      | 43      | 9.5     | 10.25                |
  `
};

type PageType = "contactUs" | "faqs" | "shipping" | "trackOrder" | "sizeGuide";

export default function HelpPagesAdmin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<PageType>("contactUs");
  const [content, setContent] = useState<Record<PageType, string>>(defaultContent);

  // In a real application, fetch the content from your database
  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/help-pages"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/admin/help-pages");
        const data = await res.json();
        // If we have stored content, use it; otherwise use defaults
        if (data && Object.keys(data).length) {
          return data;
        }
        return defaultContent;
      } catch (error) {
        // If API fails, use default content
        return defaultContent;
      }
    },
  });

  // Update content in state when data is loaded
  useState(() => {
    if (data) {
      setContent(data);
    }
  });

  // Mutation to save changes
  const saveContentMutation = useMutation({
    mutationFn: async (contentData: Record<PageType, string>) => {
      const res = await apiRequest("POST", "/api/admin/help-pages", contentData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/help-pages"] });
      toast({
        title: "Content saved",
        description: "The help page content has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving content",
        description: error.message || "There was a problem saving the content.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    saveContentMutation.mutate(content);
  };

  const handleContentChange = (value: string) => {
    setContent({
      ...content,
      [activeTab]: value,
    });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Help Pages</h1>
        <Button onClick={handleSave} disabled={saveContentMutation.isPending}>
          {saveContentMutation.isPending ? (
            <span className="flex items-center">
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
              Saving...
            </span>
          ) : (
            <span className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </span>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Help Pages</CardTitle>
          <CardDescription>
            Manage content for customer help and information pages. Changes will be published immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PageType)} className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="contactUs" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>Contact Us</span>
              </TabsTrigger>
              <TabsTrigger value="faqs" className="flex items-center">
                <LifeBuoy className="h-4 w-4 mr-2" />
                <span>FAQs</span>
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex items-center">
                <Truck className="h-4 w-4 mr-2" />
                <span>Shipping & Returns</span>
              </TabsTrigger>
              <TabsTrigger value="trackOrder" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Track Order</span>
              </TabsTrigger>
              <TabsTrigger value="sizeGuide" className="flex items-center">
                <Ruler className="h-4 w-4 mr-2" />
                <span>Size Guide</span>
              </TabsTrigger>
            </TabsList>

            {Object.keys(defaultContent).map((pageKey) => (
              <TabsContent key={pageKey} value={pageKey} className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor={`${pageKey}-content`} className="text-lg font-medium mb-2 block">
                      {pageKey === "contactUs" && "Contact Us Page Content"}
                      {pageKey === "faqs" && "Frequently Asked Questions Content"}
                      {pageKey === "shipping" && "Shipping & Returns Content"}
                      {pageKey === "trackOrder" && "Track Order Page Content"}
                      {pageKey === "sizeGuide" && "Size Guide Content"}
                    </Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Edit the content using Markdown formatting. Preview will be shown on the right.
                    </p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Textarea
                        id={`${pageKey}-content`}
                        value={content[pageKey as PageType]}
                        onChange={(e) => handleContentChange(e.target.value)}
                        className="font-mono h-[500px] resize-none"
                      />
                    </div>
                    <div className="border rounded-md p-4 bg-muted/30 overflow-auto h-[500px]">
                      <div className="prose dark:prose-invert max-w-none">
                        {/* In a real app, use a markdown renderer here */}
                        <pre className="whitespace-pre-wrap">{content[pageKey as PageType]}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave} disabled={saveContentMutation.isPending}>
            {saveContentMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
}