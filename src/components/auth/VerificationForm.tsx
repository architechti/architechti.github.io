
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Phone } from "lucide-react";

type VerificationFormProps = {
  method: "email" | "phone";
  contact: string;
  onComplete: () => void;
  onChangeMethod: () => void;
};

export function VerificationForm({ 
  method, 
  contact, 
  onComplete,
  onChangeMethod
}: VerificationFormProps) {
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    // Simulate sending a verification code
    toast.success(`Verification code sent to your ${method}`);

    // Countdown timer for resend button
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [method]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    // For demo purposes, any code works
    if (code.length < 4) {
      toast.error("Please enter a valid code");
      return;
    }

    onComplete();
  };

  const handleResend = () => {
    setTimeLeft(60);
    toast.success(`New verification code sent to your ${method}`);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify your {method}</CardTitle>
        <CardDescription>
          We've sent a verification code to{" "}
          <span className="font-medium">
            {method === "email" ? contact : contact}
          </span>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleVerify}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              {method === "email" ? (
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              ) : (
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              )}
              <Input
                id="verification-code"
                type="text"
                placeholder="Enter verification code"
                className="pl-10 text-center text-lg tracking-widest"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onChangeMethod}
            >
              Use {method === "email" ? "Phone" : "Email"} Instead
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleResend}
              disabled={timeLeft > 0}
            >
              {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend Code"}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
            Verify & Continue
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
