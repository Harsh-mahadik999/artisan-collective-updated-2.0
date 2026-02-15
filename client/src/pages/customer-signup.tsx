import { useState } from "react";
import { useLocation } from "wouter";
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function CustomerSignup() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"email" | "otp" | "password" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const { toast } = useToast();

  const handleSendOtp = async () => {
    if (!email) {
      toast({ title: "Error", description: "Please enter your email", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      // Simulate OTP send
      setTimeout(() => {
        setStep("otp");
        setOtpTimer(120);
        toast({ title: "OTP Sent!", description: `Verification code sent to ${email}` });
        
        const interval = setInterval(() => {
          setOtpTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast({ title: "Error", description: "Please enter OTP", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      // Simulate OTP verification
      setTimeout(() => {
        setStep("password");
        toast({ title: "Success!", description: "Email verified. Set your password." });
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePassword = async () => {
    if (!password || !confirmPassword) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords don't match", variant: "destructive" });
      return;
    }

    if (password.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      // Simulate account creation
      setTimeout(() => {
        setStep("success");
        toast({ title: "Account Created!", description: "Welcome to ArtisanAlley" });
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-secondary/10 to-accent/10 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader>
            <div className="text-center mb-6">
              <h2 className="text-3xl font-serif font-bold mb-2">Create Buyer Account</h2>
              <p className="text-muted-foreground">Join ArtisanAlley's community of craft enthusiasts</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              <div className={`flex items-center space-x-2 ${step === "email" || step === "otp" || step === "password" || step === "success" ? "text-secondary" : "text-muted-foreground"}`}>
                <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-semibold">1</div>
                <span className="text-xs font-medium">Email</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${(step === "otp" || step === "password" || step === "success") ? "bg-secondary" : "bg-muted"}`}></div>
              <div className={`flex items-center space-x-2 ${step === "otp" || step === "password" || step === "success" ? "text-secondary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === "otp" || step === "password" || step === "success" ? "bg-secondary text-secondary-foreground" : "bg-muted"}`}>2</div>
                <span className="text-xs font-medium">Verify</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${(step === "password" || step === "success") ? "bg-secondary" : "bg-muted"}`}></div>
              <div className={`flex items-center space-x-2 ${step === "password" || step === "success" ? "text-secondary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === "password" || step === "success" ? "bg-secondary text-secondary-foreground" : "bg-muted"}`}>3</div>
                <span className="text-xs font-medium">Password</span>
              </div>
            </div>

            {/* Email Step */}
            {step === "email" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <Button 
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </div>
            )}

            {/* OTP Step */}
            {step === "otp" && (
              <div className="space-y-4">
                <Alert className="bg-secondary/10 border-secondary/20">
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    {otpTimer > 0 ? `Code expires in ${otpTimer}s` : "Code expired. Request new one."}
                  </AlertDescription>
                </Alert>
                <div>
                  <Label htmlFor="otp" className="text-sm font-medium">Verification Code</Label>
                  <Input
                    id="otp"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    className="mt-2 text-center text-2xl tracking-widest"
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground mt-2">We sent a code to {email}</p>
                </div>
                <Button 
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </Button>
                <Button 
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Change Email
                </Button>
              </div>
            )}

            {/* Password Step */}
            {step === "password" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-sm font-medium">Create Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm" className="text-sm font-medium">Confirm Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  onClick={handleCreatePassword}
                  disabled={loading}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            )}

            {/* Success Step */}
            {step === "success" && (
              <div className="text-center space-y-6 py-8">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center animate-in fade-in-50">
                    <CheckCircle className="h-8 w-8 text-secondary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Welcome!</h3>
                  <p className="text-muted-foreground">Your account is ready. Start exploring authentic crafts.</p>
                </div>
                <Button 
                  onClick={() => setLocation("/")}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Login Link */}
            {step !== "success" && (
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <a href="/customer-login" className="text-secondary hover:underline font-medium">
                  Login here
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
