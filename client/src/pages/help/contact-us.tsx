import { useState } from "react";
import { Helmet } from "react-helmet";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactUsPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  // Fetch the contact page content
  const { data: pageContent, isLoading } = useQuery({
    queryKey: ["/api/help-pages/contactUs"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/help-pages/contactUs");
        return await res.json();
      } catch (error) {
        // Return default if API fails
        return { content: "# Contact Us\n\nWe're here to help with any questions or concerns." };
      }
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the contact form data to the server
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };
  
  return (
    <>
      <Helmet>
        <title>Contact Us | THRAX</title>
        <meta name="description" content="Get in touch with our team for inquiries, support, and feedback." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        
        <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
              <p className="text-muted-foreground mt-2">
                We'd love to hear from you. Get in touch with our team.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Get In Touch</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea 
                        id="message" 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please provide details about your inquiry..." 
                        className="min-h-[120px]"
                        required 
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      Reach out to us through these channels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Email Us</h3>
                        <p className="text-sm text-muted-foreground">
                          <a href="mailto:support@thrax.com" className="hover:underline">
                            support@thrax.com
                          </a>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          We'll respond within 24 hours
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Call Us</h3>
                        <p className="text-sm text-muted-foreground">
                          <a href="tel:+15551234567" className="hover:underline">
                            (555) 123-4567
                          </a>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Mon-Fri: 9am - 6pm ET<br />
                          Sat: 10am - 4pm ET
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Visit Us</h3>
                        <p className="text-sm text-muted-foreground">
                          123 Fashion Street<br />
                          Style City, SC 10001
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Service Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span className="font-medium">9:00 AM - 6:00 PM ET</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Saturday</span>
                        <span className="font-medium">10:00 AM - 4:00 PM ET</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Sunday</span>
                        <span className="font-medium">Closed</span>
                      </li>
                    </ul>
                    
                    <Separator className="my-4" />
                    
                    <p className="text-sm text-muted-foreground">
                      Our team strives to respond to all inquiries within 24 hours during business days.
                    </p>
                  </CardContent>
                </Card>
              </div>
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