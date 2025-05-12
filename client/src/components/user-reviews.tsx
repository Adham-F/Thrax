import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageSquare, Flag, ThumbsUp, UserCircle } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EmojiReview from "@/components/emoji-review";

interface UserReviewsProps {
  productId: number;
  className?: string;
}

interface Review {
  id: number;
  userId: number;
  username: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  userHasMarkedHelpful: boolean;
  verified: boolean;
}

export default function UserReviews({ productId, className }: UserReviewsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // In a real application, these would come from an API
  const reviews: Review[] = [
    {
      id: 1,
      userId: 2,
      username: "EmmaS",
      rating: 5,
      title: "Absolutely love it!",
      comment: "This product exceeded all my expectations. The quality is exceptional and it works perfectly for what I needed. Highly recommend to anyone considering this purchase!",
      date: "2023-04-15",
      helpful: 24,
      userHasMarkedHelpful: false,
      verified: true
    },
    {
      id: 2,
      userId: 3,
      username: "JasonT",
      rating: 4,
      title: "Great product with minor issues",
      comment: "Overall, I'm very satisfied with this purchase. The product is well-made and functions as advertised. The only downside is the battery life could be better, but it's not a deal-breaker.",
      date: "2023-05-02",
      helpful: 16,
      userHasMarkedHelpful: true,
      verified: true
    },
    {
      id: 3,
      userId: 4,
      username: "SarahK",
      rating: 3,
      title: "Good, but not great",
      comment: "The product is decent for the price point. It does the job, but there are better options available if you're willing to spend a bit more. The design is nice though.",
      date: "2023-06-10",
      helpful: 8,
      userHasMarkedHelpful: false,
      verified: false
    }
  ];
  
  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
  
  // Rating counts
  const ratingCounts = [0, 0, 0, 0, 0]; // 1-5 stars
  reviews.forEach(review => {
    ratingCounts[review.rating - 1]++;
  });
  
  // Filter reviews
  const filteredReviews = filter === "all" 
    ? reviews 
    : filter === "verified" 
      ? reviews.filter(r => r.verified)
      : reviews.filter(r => r.rating === parseInt(filter));
  
  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to leave a review",
        variant: "destructive",
      });
      return;
    }
    
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and comment for your review",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would submit the review to the API
      // await apiRequest("POST", "/api/reviews", {
      //   productId,
      //   rating: reviewRating,
      //   title: reviewTitle,
      //   comment: reviewComment
      // });
      
      // Mock submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReviewDialogOpen(false);
      setReviewTitle("");
      setReviewComment("");
      setReviewRating(5);
      setIsSubmitting(false);
      
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Error submitting review",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleMarkHelpful = (reviewId: number) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to mark reviews as helpful",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would call the API to mark the review as helpful
    // Here we just show the toast
    toast({
      title: "Thank you!",
      description: "Your feedback helps other shoppers",
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        {/* Summary */}
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>
              Based on {reviews.length} reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="flex mr-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-5 w-5",
                      star <= Math.round(averageRating) 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-lg font-bold">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground ml-2">out of 5</span>
            </div>
            
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <div className="w-12 text-sm">{rating} star{rating !== 1 ? 's' : ''}</div>
                  <div className="flex-1 mx-3 h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full" 
                      style={{ 
                        width: `${reviews.length ? (ratingCounts[rating - 1] / reviews.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <div className="w-8 text-xs text-right">
                    {ratingCounts[rating - 1]}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">Write a Review</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                  <DialogDescription>
                    Share your experience with this product. Your review will help other customers make better purchasing decisions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={cn(
                              "h-6 w-6 transition-colors",
                              star <= reviewRating 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Review Title</Label>
                    <Input
                      id="title"
                      placeholder="Summarize your experience"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="comment">Your Review</Label>
                    <Textarea
                      id="comment"
                      placeholder="What did you like or dislike? How was the quality?"
                      rows={5}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quick Rating</Label>
                    <EmojiReview productId={productId} />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setReviewDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
        
        {/* Reviews List */}
        <div className="w-full md:w-2/3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Reviews</h3>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter reviews" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Filter by</SelectLabel>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="verified">Verified Purchases</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {filteredReviews.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No reviews match your filter.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            <UserCircle className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{review.username}</h4>
                            {review.verified && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-100">
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-4 w-4",
                              star <= review.rating 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <h5 className="font-medium mb-1">{review.title}</h5>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between text-xs text-muted-foreground pt-2">
                    <div className="flex items-center space-x-4">
                      <button
                        className={cn(
                          "flex items-center hover:text-foreground",
                          review.userHasMarkedHelpful && "text-primary"
                        )}
                        onClick={() => handleMarkHelpful(review.id)}
                      >
                        <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                      <button className="flex items-center hover:text-foreground">
                        <Flag className="h-3.5 w-3.5 mr-1" />
                        <span>Report</span>
                      </button>
                    </div>
                    <button className="flex items-center hover:text-foreground">
                      <MessageSquare className="h-3.5 w-3.5 mr-1" />
                      <span>Comment</span>
                    </button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}