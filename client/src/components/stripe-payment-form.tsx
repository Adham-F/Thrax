import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

// Get the Stripe public key from environment variables
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error("Missing Stripe public key. Please set VITE_STRIPE_PUBLIC_KEY in your environment variables.");
}

// Load Stripe outside of component render to avoid recreation on each render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  clientSecret: string;
  amount: number;
  onPaymentSuccess: () => void;
  onPaymentError: (message: string) => void;
}

function CheckoutForm({ clientSecret, amount, onPaymentSuccess, onPaymentError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
          // In a production app, we would handle order creation here or after successful payment
        },
        redirect: "if_required",
      });

      if (error) {
        setPaymentError(error.message || "Payment failed. Please try again.");
        onPaymentError(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast({
          title: "Payment successful!",
          description: `Your payment of $${(amount / 100).toFixed(2)} has been processed.`,
        });
        onPaymentSuccess();
      } else {
        setPaymentError("Unexpected payment status. Please contact support.");
        onPaymentError("Unexpected payment status");
      }
    } catch (err) {
      const errorMessage = (err as Error).message || "An unexpected error occurred";
      setPaymentError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {paymentError && (
        <div className="text-sm text-red-500 p-2 bg-red-50 rounded">
          {paymentError}
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${(amount / 100).toFixed(2)}`
        )}
      </Button>
    </form>
  );
}

interface StripePaymentFormProps {
  amount: number;
  onPaymentSuccess: () => void;
  onPaymentError: (message: string) => void;
  className?: string;
}

export default function StripePaymentForm({ 
  amount, 
  onPaymentSuccess, 
  onPaymentError,
  className 
}: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create a payment intent when the component mounts
  useEffect(() => {
    async function createPaymentIntent() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", { 
          amount,
          currency: "usd",
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.message || "Failed to initialize payment");
          onPaymentError(data.message || "Failed to initialize payment");
        }
      } catch (err) {
        const errorMessage = (err as Error).message || "An unexpected error occurred";
        setError(errorMessage);
        onPaymentError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
    
    createPaymentIntent();
  }, [amount, onPaymentError]);
  
  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !clientSecret) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="text-red-500">Payment Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error || "Unable to initialize payment"}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()} className="w-full">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  const options = {
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#7000FF',
        colorBackground: '#1a1a1a',
        colorText: '#ffffff',
        colorDanger: '#ff4d4f',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSizeBase: '15px',
        borderRadius: '6px',
      },
    },
  };
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm 
            clientSecret={clientSecret}
            amount={amount}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
          />
        </Elements>
      </CardContent>
    </Card>
  );
}