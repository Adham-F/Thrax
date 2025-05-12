import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Link as LinkIcon, 
  Share2
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareBadgesProps {
  productId: number;
  productName: string;
  className?: string;
}

export default function SocialShareBadges({ 
  productId, 
  productName, 
  className 
}: SocialShareBadgesProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const productUrl = `${window.location.origin}/product/${productId}`;
  const shareText = `Check out this awesome ${productName} I found on THRAX!`;
  
  const shareLinks = [
    {
      name: "Facebook",
      icon: <Facebook className="h-4 w-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(shareText)}`,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-4 w-4" />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`,
      color: "bg-sky-500 hover:bg-sky-600"
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-4 w-4" />,
      color: "bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 hover:from-yellow-600 hover:via-pink-600 hover:to-purple-600"
    }
  ];

  const handleShare = (name: string, url?: string) => {
    if (name === "Instagram") {
      // Instagram doesn't support direct sharing via URL, so we'll just copy the link
      copyToClipboard();
      toast({
        title: "Link copied!",
        description: "Share it on Instagram by pasting in your post or story.",
      });
      return;
    }
    
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(productUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard",
      });
    });
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center">
          <Share2 className="h-4 w-4 mr-2" />
          Share this product
        </h3>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={copyToClipboard}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "Copied!" : "Copy link"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-center space-x-2">
        {shareLinks.map((link) => (
          <TooltipProvider key={link.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={cn("text-white", link.color)}
                  size="icon"
                  onClick={() => handleShare(link.name, link.url)}
                >
                  {link.icon}
                  <span className="sr-only">Share on {link.name}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share on {link.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}