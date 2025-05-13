import { useState } from "react";
import AdminLayout from "@/components/admin/layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Download, 
  Mail, 
  Send, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Search,
  Trash2,
  MoreHorizontal,
  Edit,
  Copy
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Types
interface Subscriber {
  id: number;
  email: string;
  createdAt: string;
  active: boolean;
}

interface Campaign {
  id: number;
  subject: string;
  content: string;
  sentAt: string | null;
  status: 'draft' | 'sent' | 'scheduled';
  recipients: number;
}

// Form validation schemas
const newSubscriberSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

const newCampaignSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(10, "Content must be at least 10 characters")
});

export default function NewslettersAdmin() {
  const { toast } = useToast();
  const [isNewSubscriberOpen, setIsNewSubscriberOpen] = useState(false);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch subscribers from API
  const { data: subscribers = [], isLoading: isLoadingSubscribers } = useQuery({
    queryKey: ["/api/admin/subscribers"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/admin/subscribers");
        return await res.json();
      } catch (error) {
        // If API fails, return empty array
        return [];
      }
    }
  });
  
  // Fetch campaigns from API
  const { data: campaigns = [], isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ["/api/admin/campaigns"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/admin/campaigns");
        return await res.json();
      } catch (error) {
        // If API fails, return empty array
        return [];
      }
    }
  });
  
  // New subscriber form
  const newSubscriberForm = useForm<NewSubscriberFormValues>({
    resolver: zodResolver(newSubscriberSchema),
    defaultValues: {
      email: ""
    }
  });
  
  // New campaign form
  const newCampaignForm = useForm<NewCampaignFormValues>({
    resolver: zodResolver(newCampaignSchema),
    defaultValues: {
      subject: "",
      content: ""
    }
  });
  
  // Filter subscribers based on search query
  const filteredSubscribers = subscribers.filter(
    (subscriber: Subscriber) => subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Add subscriber mutation
  const addSubscriberMutation = useMutation({
    mutationFn: async (data: NewSubscriberFormValues) => {
      const res = await apiRequest("POST", "/api/admin/subscribers", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscriber added",
        description: "The subscriber has been added successfully."
      });
      newSubscriberForm.reset();
      setIsNewSubscriberOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscribers"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add subscriber",
        variant: "destructive"
      });
    }
  });
  
  // Add campaign mutation
  const addCampaignMutation = useMutation({
    mutationFn: async (data: NewCampaignFormValues) => {
      const res = await apiRequest("POST", "/api/admin/campaigns", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Campaign created",
        description: "The campaign has been created successfully."
      });
      newCampaignForm.reset();
      setIsNewCampaignOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/campaigns"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive"
      });
    }
  });
  
  const onSubscriberSubmit = (data: NewSubscriberFormValues) => {
    addSubscriberMutation.mutate(data);
  };
  
  const onCampaignSubmit = (data: NewCampaignFormValues) => {
    addCampaignMutation.mutate(data);
  };
  
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Email Marketing</h1>
      </div>
      
      <Tabs defaultValue="subscribers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="subscribers" className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            Subscribers
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center">
            <Send className="mr-2 h-4 w-4" />
            Campaigns
          </TabsTrigger>
        </TabsList>
        
        {/* Subscribers Tab */}
        <TabsContent value="subscribers">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Email Subscribers</CardTitle>
                  <CardDescription>
                    Manage your newsletter subscriber list.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog open={isNewSubscriberOpen} onOpenChange={setIsNewSubscriberOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Subscriber
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Subscriber</DialogTitle>
                      </DialogHeader>
                      <Form {...newSubscriberForm}>
                        <form onSubmit={newSubscriberForm.handleSubmit(onSubscriberSubmit)} className="space-y-4">
                          <FormField
                            control={newSubscriberForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="email@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end gap-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setIsNewSubscriberOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit"
                              disabled={addSubscriberMutation.isPending}
                            >
                              {addSubscriberMutation.isPending ? (
                                <span className="flex items-center">
                                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                                  Adding...
                                </span>
                              ) : (
                                <>Add Subscriber</>
                              )}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search subscribers..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email Address</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingSubscribers ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          <div className="flex justify-center items-center h-full">
                            <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredSubscribers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No subscribers found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSubscribers.map((subscriber: Subscriber) => (
                        <TableRow key={subscriber.id}>
                          <TableCell>{subscriber.email}</TableCell>
                          <TableCell>{new Date(subscriber.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span className={`flex items-center ${subscriber.active ? "text-green-500" : "text-red-500"}`}>
                              {subscriber.active ? (
                                <>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Unsubscribed
                                </>
                              )}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredSubscribers.length} of {subscribers.length} subscribers
                </p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Email Campaigns</CardTitle>
                  <CardDescription>
                    Create and manage email campaigns.
                  </CardDescription>
                </div>
                <Dialog open={isNewCampaignOpen} onOpenChange={setIsNewCampaignOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Campaign
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <DialogTitle>Create New Campaign</DialogTitle>
                    </DialogHeader>
                    <Form {...newCampaignForm}>
                      <form onSubmit={newCampaignForm.handleSubmit(onCampaignSubmit)} className="space-y-4">
                        <FormField
                          control={newCampaignForm.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject Line</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter email subject..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={newCampaignForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Content</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Write your email content here..." 
                                  className="min-h-[200px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsNewCampaignOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            disabled={addCampaignMutation.isPending}
                          >
                            {addCampaignMutation.isPending ? (
                              <span className="flex items-center">
                                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                                Creating...
                              </span>
                            ) : (
                              <>Save Campaign</>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingCampaigns ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <div className="flex justify-center items-center h-full">
                            <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : campaigns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No campaigns found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      campaigns.map((campaign: Campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell>{campaign.subject}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              campaign.status === 'sent' ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400" :
                              campaign.status === 'scheduled' ? "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400" :
                              "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400"
                            }`}>
                              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>{campaign.recipients}</TableCell>
                          <TableCell>
                            {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString() : "Not sent yet"}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                {campaign.status === 'draft' && (
                                  <DropdownMenuItem>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Now
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}