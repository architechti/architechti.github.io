
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { VerificationForm } from "./VerificationForm";
import { toast } from "sonner";
import { Mail, Phone } from "lucide-react";

type AuthFormProps = {
  onAuthComplete: () => void;
};

export function AuthForm({ onAuthComplete }: AuthFormProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Συμπλήρωσε το email σου");
      return;
    }
    if (!password) {
      toast.error("Συμπλήρωσε τον κωδικό");
      return;
    }
    
    // For demo purposes, we'll pretend the login was successful
    toast.success("Σύνδεση επιτυχής!");
    onAuthComplete();
    navigate("/dashboard");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Συμπλήρωσε το email σου");
      return;
    }
    if (!phone) {
      toast.error("Συμπλήρωσε τον τηλεφωνικό σου αριθμό");
      return;
    }
    if (!password) {
      toast.error("Συμπλήρωσε τον κωδικό σου");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Οι κωδικοί δεν είναι όμοιοι ");
      return;
    }
    
    // For demo purposes, we'll send a verification code
    setShowVerification(true);
  };

  const handleVerificationComplete = () => {
    toast.success("Ο λογαριασμός δημιουργήθηκε επιτυχώς!");
    onAuthComplete();
    navigate("/dashboard");
  };

  if (showVerification) {
    return (
      <VerificationForm 
        method={verificationMethod}
        contact={verificationMethod === "email" ? email : phone}
        onComplete={handleVerificationComplete}
        onChangeMethod={() => setVerificationMethod(verificationMethod === "email" ? "phone" : "email")}
      />
    );
  }

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full max-w-md mx-auto">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="login">Σύνδεση</TabsTrigger>
        <TabsTrigger value="signup">Εγγραφή</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Καλωσήρθες</CardTitle>
            <CardDescription>Συμπλήρωσε τα στοιχεία σου για σύνδεση</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Ηλ.Ταχυδρομείο</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Κωδικός</Label>
                  <Button variant="link" size="sm" className="px-0 h-auto font-normal">
                    Ξέχασες το κωδικό σου?
                  </Button>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">Σύνδεση</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Δημιούργησε λογαριασμό</CardTitle>
            <CardDescription>Συμπλήρωσε τα στοιχεία σου για να συνεχίσεις</CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Ηλ.Ταχυδρομείο</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="you@example.com" 
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Κινητό</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+1 (555) 123-4567" 
                    className="pl-10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Κωδικός</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Επανάληψη κωδικού</Label>
                <Input 
                  id="confirm-password" 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">Εγγραφή</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
