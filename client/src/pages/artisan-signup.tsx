import { useState } from "react";
import { useLocation } from "wouter";
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Wand2, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function ArtisanSignup() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"email" | "otp" | "profile" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [artisanName, setArtisanName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const { toast } = useToast();

  const specialties = [
    "Ceramics & Pottery",
    "Textiles & Weaving",
    "Woodworking",
    "Jewelry Making",
    "Glasswork",
    "Metalwork",
    "Leatherwork",
    "Basketry",
    "Painting & Sculpture",
    "Other",
  ];

  const handleSendOtp = async () => {
    if (!email) {
      toast({ title: "Error", description: "Please enter your email", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
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
      setTimeout(() => {
        setStep("profile");
        toast({ title: "Success!", description: "Email verified. Complete your profile." });
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    if (!artisanName || !specialty || !location || !phone || !password) {
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
      setTimeout(() => {
        setStep("success");
        toast({ title: "Welcome Artisan!", description: "Your profile is ready" });
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Wand2 className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-2">Join as Artisan</h2>
              <p className="text-muted-foreground">Showcase and sell your handcrafted creations</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Step */}
            {step === "email" && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-sm font-medium text-muted-foreground">Step 1 of 3: Verify Email</p>
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="artisan@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <Button 
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </div>
            )}

            {/* OTP Step */}
            {step === "otp" && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-sm font-medium text-muted-foreground">Step 2 of 3: Verify Code</p>
                </div>
                <Alert className="bg-primary/10 border-primary/20">
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
                  <p className="text-xs text-muted-foreground mt-2">Check {email}</p>
                </div>
                <Button 
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
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

            {/* Profile Step */}
            {step === "profile" && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-sm font-medium text-muted-foreground">Step 3 of 3: Complete Profile</p>
                </div>

                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Full name"
                    value={artisanName}
                    onChange={(e) => setArtisanName(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="specialty" className="text-sm font-medium">Specialty</Label>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select your craft type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pass" className="text-sm font-medium">Create Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="pass"
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
                  onClick={handleCreateProfile}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? "Creating Profile..." : "Complete Registration"}
                </Button>
              </div>
            )}

            {/* Success Step */}
            {step === "success" && (
              <div className="text-center space-y-6 py-8">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-in fade-in-50">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Welcome, {artisanName}!</h3>
                  <p className="text-muted-foreground">Your artisan profile is ready. Start showcasing your crafts.</p>
                </div>
                <Button 
                  onClick={() => navigate("/")}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}

            {/* Login Link */}
            {step !== "success" && (
              <p className="text-center text-sm text-muted-foreground">
                Already registered?{" "}
                <a href="/artisan-login" className="text-primary hover:underline font-medium">
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
