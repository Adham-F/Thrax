import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EmojiReviewProps {
  productId: number;
  className?: string;
}

type Emoji = "😍" | "👍" | "😐" | "👎" | "😡";

const emojis: { emoji: Emoji; label: string }[] = [
  { emoji: "😍", label: "Love it" },
  { emoji: "👍", label: "Like it" },
  { emoji: "😐", label: "It's OK" },
  { emoji: "👎", label: "Not great" },
  { emoji: "😡", label: "Hate it" },
];

export default function EmojiReview({ productId, className }: EmojiReviewProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const handleEmojiClick = async (emoji: Emoji) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to leave a review",
        variant: "destructive",
      });
      return;
    }

    setSelectedEmoji(emoji);
    
    if (!hasReviewed) {
      setIsSubmitting(true);
      try {
        // In a real app, this would send the review to your API
        // await apiRequest("POST", "/api/reviews", { productId, emoji, userId: user.id });
        
        // Mock successful review
        setTimeout(() => {
          setHasReviewed(true);
          setIsSubmitting(false);
          
          toast({
            title: "Thanks for your review!",
            description: `You rated this product ${emoji}`,
          });
        }, 500);
      } catch (error) {
        setIsSubmitting(false);
        toast({
          title: "Error submitting review",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-medium">Quick Review</h3>
      <div className="flex items-center justify-between border rounded-lg p-3">
        {emojis.map(({ emoji, label }) => (
          <button
            key={emoji}
            onClick={() => handleEmojiClick(emoji)}
            disabled={isSubmitting}
            className={cn(
              "flex flex-col items-center space-y-1 transition-all p-2 rounded-lg",
              selectedEmoji === emoji
                ? "bg-muted scale-110"
                : "hover:bg-muted/50 hover:scale-105"
            )}
          >
            <span className="text-2xl" role="img" aria-label={label}>
              {emoji}
            </span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </button>
        ))}
      </div>
      {hasReviewed && (
        <p className="text-xs text-muted-foreground text-center">
          Thanks for your feedback! Your review helps other shoppers.
        </p>
      )}
    </div>
  );
}