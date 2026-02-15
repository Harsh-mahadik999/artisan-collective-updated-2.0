import { useState } from "react";
import { useLocation } from "wouter";
import { Mail, Lock, Eye, EyeOff, CheckCircle, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export default function ArtisanLogin() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"email" | "password" | "success">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = async () => {
    if (!email) {
      toast({ title: "Error", description: "Please enter your email", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      setTimeout(() => {
        setStep("password");
        toast({ title: "Success!", description: "Enter your password" });
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!password) {
      toast({ title: "Error", description: "Please enter your password", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      setTimeout(() => {
        setStep("success");
        toast({ title: "Welcome back!", description: "Login successful" });
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
                <Hammer className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-2">Artisan Login</h2>
              <p className="text-muted-foreground">Manage your creative business</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Step */}
            {step === "email" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="artisan@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2"
                    disabled={loading}
                  />
                </div>
                <Button 
                  onClick={handleEmailSubmit}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? "Checking..." : "Continue"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-muted-foreground">or</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" disabled={loading}>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Login with Gmail
                </Button>
              </div>
            )}

            {/* Password Step */}
            {step === "password" && (
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Email: <span className="font-semibold text-foreground">{email}</span></p>
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <Label htmlFor="remember" className="text-sm font-medium cursor-pointer">Remember me</Label>
                  </div>
                  <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
                </div>

                <Button 
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <Button 
                  onClick={() => {
                    setStep("email");
                    setPassword("");
                  }}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  Use different email
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
                  <h3 className="text-xl font-semibold mb-2">Welcome Back!</h3>
                  <p className="text-muted-foreground">You're successfully logged in</p>
                </div>
                <Button 
                  onClick={() => setLocation("/")}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}

            {/* Signup Link */}
            {step !== "success" && (
              <p className="text-center text-sm text-muted-foreground">
                Don't have an artisan account?{" "}
                <a href="/artisan-signup" className="text-primary hover:underline font-medium">
                  Sign up here
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
