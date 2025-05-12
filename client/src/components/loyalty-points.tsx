import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Award,
  Gift,
  ShoppingBag, 
  User,
  Star,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LoyaltyPointsProps {
  className?: string;
}

type LoyaltyTier = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";

interface TierInfo {
  name: LoyaltyTier;
  icon: React.ReactNode;
  color: string;
  minPoints: number;
  maxPoints?: number;
  benefits: string[];
}

export default function LoyaltyPoints({ className }: LoyaltyPointsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  if (!user) return null;
  
  // Mock loyalty points and tier (in a real application, this would come from user data)
  const loyaltyPoints = user.loyaltyPoints || 0;
  const loyaltyTier = user.loyaltyTier as LoyaltyTier || "Bronze";
  
  const tiers: TierInfo[] = [
    {
      name: "Bronze",
      icon: <Award className="h-4 w-4" />,
      color: "text-amber-700",
      minPoints: 0,
      maxPoints: 99,
      benefits: ["Free shipping on orders over $50", "Birthday discount"]
    },
    {
      name: "Silver",
      icon: <Award className="h-4 w-4" />,
      color: "text-slate-400",
      minPoints: 100,
      maxPoints: 299,
      benefits: ["Free shipping on all orders", "Early access to sales", "5% discount on all purchases"]
    },
    {
      name: "Gold",
      icon: <Award className="h-4 w-4" />,
      color: "text-yellow-500",
      minPoints: 300,
      maxPoints: 699,
      benefits: ["Priority customer support", "10% discount on all purchases", "Exclusive access to limited products"]
    },
    {
      name: "Platinum",
      icon: <Star className="h-4 w-4" />,
      color: "text-blue-500",
      minPoints: 700,
      maxPoints: 1499,
      benefits: ["15% discount on all purchases", "Free returns", "Dedicated customer service line"]
    },
    {
      name: "Diamond",
      icon: <Sparkles className="h-4 w-4" />,
      color: "text-purple-500",
      minPoints: 1500,
      benefits: ["20% discount on all purchases", "Free gifts with purchase", "VIP events", "Personal shopper"]
    }
  ];
  
  const currentTier = tiers.find(tier => tier.name === loyaltyTier) || tiers[0];
  const nextTier = tiers.find(tier => tier.minPoints > loyaltyPoints);
  
  const pointsNeeded = nextTier ? nextTier.minPoints - loyaltyPoints : 0;
  const progress = nextTier 
    ? ((loyaltyPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;
  
  const handleCheckRewards = () => {
    toast({
      title: "Coming Soon!",
      description: "The rewards catalog will be available soon.",
    });
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className={cn(
        "bg-gradient-to-r py-4",
        loyaltyTier === "Bronze" && "from-amber-100 to-amber-300 dark:from-amber-900/40 dark:to-amber-700/40",
        loyaltyTier === "Silver" && "from-slate-100 to-slate-300 dark:from-slate-800/60 dark:to-slate-600/60",
        loyaltyTier === "Gold" && "from-yellow-100 to-yellow-300 dark:from-yellow-900/40 dark:to-yellow-700/40",
        loyaltyTier === "Platinum" && "from-blue-100 to-blue-300 dark:from-blue-900/40 dark:to-blue-700/40",
        loyaltyTier === "Diamond" && "from-purple-100 to-purple-300 dark:from-purple-900/40 dark:to-purple-700/40",
      )}>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <span className={cn("mr-2", currentTier.color)}>
              {currentTier.icon}
            </span>
            {loyaltyTier} Member
          </span>
          <span className="text-sm font-normal">{loyaltyPoints} points</span>
        </CardTitle>
        <CardDescription>
          {nextTier 
            ? `${pointsNeeded} more points to reach ${nextTier.name}`
            : "You've reached the highest tier!"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>{currentTier.name}</span>
              {nextTier && <span>{nextTier.name}</span>}
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Your Benefits:</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              {currentTier.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Sparkles className="h-3 w-3" />
                  </div>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-muted/50">
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              <span>1 pt per $1</span>
            </div>
            <div className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-muted/50">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>5 pts review</span>
            </div>
            <div className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-muted/50">
              <Gift className="h-4 w-4 text-muted-foreground" />
              <span>10 pts referral</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCheckRewards}
              >
                View Rewards
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Check available rewards</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open("/my-points", "_blank")}
              >
                Point History
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View your points history</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}