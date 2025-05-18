import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';
import { Link } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { EditableSection } from '@/components/admin/editable-section';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, FileText, HelpCircle, Truck, Phone, Info } from 'lucide-react';

// Mock help page content
const helpPages = [
  {
    id: 'faqs',
    title: 'Frequently Asked Questions',
    content: `<h1>Frequently Asked Questions</h1>
<h2>Shipping & Delivery</h2>
<p><strong>Q: How long does shipping take?</strong><br>A: Standard shipping takes 3-7 business days. Express shipping takes 1-3 business days.</p>
<p><strong>Q: Do you ship internationally?</strong><br>A: Yes, we ship to most countries worldwide. International shipping times vary.</p>

<h2>Returns & Refunds</h2>
<p><strong>Q: What is your return policy?</strong><br>A: We offer a 30-day return policy for most items in original condition.</p>
<p><strong>Q: How do I start a return?</strong><br>A: Log into your account, go to your orders, and follow the return instructions.</p>`,
    route: '/help/faqs'
  },
  {
    id: 'shipping',
    title: 'Shipping Information',
    content: `<h1>Shipping Information</h1>
<h2>Shipping Methods</h2>
<ul>
  <li><strong>Standard Shipping:</strong> 3-7 business days - $5.99</li>
  <li><strong>Express Shipping:</strong> 1-3 business days - $12.99</li>
  <li><strong>Overnight Shipping:</strong> Next business day (order by 2PM) - $24.99</li>
</ul>
<p>Free standard shipping on orders over $50!</p>

<h2>International Shipping</h2>
<p>We ship to most countries worldwide. International shipping rates and delivery times vary by destination.</p>`,
    route: '/help/shipping'
  },
  {
    id: 'contact-us',
    title: 'Contact Us',
    content: `<h1>Contact Us</h1>
<p>We're here to help! Reach out to our customer service team with any questions or concerns.</p>

<h2>Customer Service Hours</h2>
<p>Monday - Friday: 9AM - 6PM EST<br>
Saturday: 10AM - 4PM EST<br>
Sunday: Closed</p>

<h2>Contact Methods</h2>
<ul>
  <li><strong>Email:</strong> support@thrax.com</li>
  <li><strong>Phone:</strong> 1-800-THRAX-CS (1-800-847-2927)</li>
  <li><strong>Live Chat:</strong> Available during business hours</li>
</ul>`,
    route: '/help/contact-us'
  },
  {
    id: 'size-guide',
    title: 'Size Guide',
    content: `<h1>Size Guide</h1>
<p>Find your perfect fit with our comprehensive size guides for all product categories.</p>

<h2>Clothing Sizes</h2>
<table border="1" cellpadding="5">
  <tr>
    <th>Size</th>
    <th>Chest (in)</th>
    <th>Waist (in)</th>
    <th>Hips (in)</th>
  </tr>
  <tr>
    <td>XS</td>
    <td>32-34</td>
    <td>26-28</td>
    <td>34-36</td>
  </tr>
  <tr>
    <td>S</td>
    <td>35-37</td>
    <td>29-31</td>
    <td>37-39</td>
  </tr>
  <tr>
    <td>M</td>
    <td>38-40</td>
    <td>32-34</td>
    <td>40-42</td>
  </tr>
  <tr>
    <td>L</td>
    <td>41-43</td>
    <td>35-37</td>
    <td>43-45</td>
  </tr>
  <tr>
    <td>XL</td>
    <td>44-46</td>
    <td>38-40</td>
    <td>46-48</td>
  </tr>
</table>`,
    route: '/help/size-guide'
  },
  {
    id: 'track-order',
    title: 'Track Your Order',
    content: `<h1>Track Your Order</h1>
<p>Follow these steps to track your THRAX order:</p>

<h2>For Registered Users</h2>
<ol>
  <li>Log in to your THRAX account</li>
  <li>Go to "My Orders" in your account dashboard</li>
  <li>Select the order you want to track</li>
  <li>Click the "Track Package" button</li>
</ol>

<h2>For Guest Orders</h2>
<ol>
  <li>Go to our order tracking page</li>
  <li>Enter your order number (found in your order confirmation email)</li>
  <li>Enter the email address used for the order</li>
  <li>Click "Track"</li>
</ol>`,
    route: '/help/track-order'
  }
];

const AdminHelpPages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState(helpPages[0]);
  const [editedContent, setEditedContent] = useState(selectedPage.content);
  const [isEditing, setIsEditing] = useState(false);

  // Redirect if not admin
  if (!user) {
    return <Redirect to="/auth" />;
  }

  // Update help page content mutation
  const { mutate: updateHelpPage, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      // In a real app, this would save to the database
      const response = await apiRequest('POST', '/api/admin/help-pages/update', { id, content });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Help Page Updated',
        description: 'The help page content has been updated successfully.',
      });
      setIsEditing(false);
      // In a real app, we would invalidate queries
      // queryClient.invalidateQueries(['/api/help-pages']);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Update Help Page',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Handle page selection
  const handlePageSelect = (page: any) => {
    setSelectedPage(page);
    setEditedContent(page.content);
    setIsEditing(false);
  };

  // Handle content save
  const handleSave = () => {
    updateHelpPage({ id: selectedPage.id, content: editedContent });
  };

  // Get icon for help page
  const getPageIcon = (id: string) => {
    switch (id) {
      case 'faqs':
        return <HelpCircle className="h-5 w-5" />;
      case 'shipping':
        return <Truck className="h-5 w-5" />;
      case 'contact-us':
        return <Phone className="h-5 w-5" />;
      case 'size-guide':
        return <FileText className="h-5 w-5" />;
      case 'track-order':
        return <Info className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Help Pages | THRAX Admin</title>
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 container max-w-7xl py-10 px-4 mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Help Pages</h1>
            <p className="text-muted-foreground">Edit and update the help content for your customers</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Help Pages</CardTitle>
                  <CardDescription>Select a page to edit</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <Accordion type="single" collapsible defaultValue="help-pages">
                    <AccordionItem value="help-pages">
                      <AccordionTrigger className="px-6">Help Pages</AccordionTrigger>
                      <AccordionContent className="pb-0">
                        <div className="space-y-1">
                          {helpPages.map((page) => (
                            <Button
                              key={page.id}
                              variant={selectedPage.id === page.id ? "secondary" : "ghost"}
                              className="w-full justify-start pl-10"
                              onClick={() => handlePageSelect(page)}
                            >
                              <div className="flex items-center">
                                {getPageIcon(page.id)}
                                <span className="ml-2">{page.title}</span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Content editor */}
            <div className="col-span-1 lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{selectedPage.title}</CardTitle>
                      <CardDescription>
                        Page URL: <Link href={selectedPage.route} className="text-primary hover:underline" target="_blank">{selectedPage.route}</Link>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? 'Cancel Edit' : 'Edit Page'}
                      </Button>
                      {isEditing && (
                        <Button
                          onClick={handleSave}
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                              Saving
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" /> Save Changes
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="edit" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="edit">
                        {isEditing ? 'Edit Content' : 'View Content'}
                      </TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="content">HTML Content</Label>
                            <Textarea
                              id="content"
                              className="h-[600px] font-mono text-sm"
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                            />
                          </div>
                        </div>
                      ) : (
                        <EditableSection
                          id={`help-page-${selectedPage.id}`}
                          title={selectedPage.title}
                          path={`db:help_pages:content:${selectedPage.id}`}
                          content={selectedPage.content}
                          description="Click 'Edit Page' to modify this content"
                        />
                      )}
                    </TabsContent>
                    <TabsContent value="preview">
                      <Card>
                        <CardContent className="pt-6">
                          <div
                            className="prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: isEditing ? editedContent : selectedPage.content }}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
};

export default AdminHelpPages;