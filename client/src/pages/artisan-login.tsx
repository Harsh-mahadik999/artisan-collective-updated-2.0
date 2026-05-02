import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, CheckCircle, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/auth-context";

export default function ArtisanLogin() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"email" | "password" | "success">("email");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    name: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { toast } = useToast();
  const { login } = useAuth();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Reusable field validator keeps rules easy to maintain.
  const getFieldError = (field: "email" | "name" | "password", value: string) => {
    if (field === "email") {
      if (!value.trim()) return "Email is required";
      if (!emailPattern.test(value.trim())) return "Invalid email";
      return "";
    }
    if (field === "name") {
      if (!value.trim()) return "Name is required";
      return "";
    }
    if (field === "password") {
      if (!value.trim()) return "Password is required";
      return "";
    }
    return "";
  };

  const validateEmail = () => {
    const newErrors = { email: getFieldError("email", email), name: "", password: "" };

    setErrors(newErrors);
    return !newErrors.email;
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail()) return;

    setLoading(true);
    try {
      await wait(1000);
      setStep("password");
      // Clear step-specific errors to avoid stale messages when moving forward.
      setErrors((prev) => ({ ...prev, name: "", password: "" }));
      toast({ title: "Success!", description: "Enter your password" });
    } finally {
      setLoading(false);
    }
  };

  const validateLogin = () => {
    const newErrors = {
      email: "",
      name: getFieldError("name", name),
      password: getFieldError("password", password)
    };

    setErrors(newErrors);
    return !newErrors.name && !newErrors.password;
  };

  const isEmailStepValid = email.trim() && !getFieldError("email", email);
  const isPasswordStepValid =
    name.trim() &&
    password.trim() &&
    !getFieldError("name", name) &&
    !getFieldError("password", password);

  const handleLogin = async () => {
    if (!validateLogin()) return;

    setLoading(true);
    try {
      await wait(1000);
      login("artisan", name.trim());
      setStep("success");
      toast({ title: "Welcome back!", description: "Login successful" });
    } finally {
      setLoading(false);
    }
  };

  return (
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

          {/* EMAIL STEP */}
          {step === "email" && (
            <div className="space-y-4">
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="artisan@email.com"
                  value={email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value);
                    setErrors((prev) => ({ ...prev, email: getFieldError("email", value) }));
                  }}
                  className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <Button
                onClick={handleEmailSubmit}
                disabled={loading || !isEmailStepValid}
                className="w-full"
              >
                {loading ? "Checking..." : "Continue"}
              </Button>
            </div>
          )}

          {/* PASSWORD STEP */}
          {step === "password" && (
            <div className="space-y-4">

              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm">
                  Email: <span className="font-semibold">{email}</span>
                </p>
              </div>

              <div>
                <Label>Your Name</Label>
                <Input
                  value={name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setName(value);
                    setErrors((prev) => ({ ...prev, name: getFieldError("name", value) }));
                  }}
                  className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPassword(value);
                      setErrors((prev) => ({ ...prev, password: getFieldError("password", value) }));
                    }}
                    className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                    disabled={loading}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    className="absolute right-3 top-2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                  />
                  <Label>Remember me</Label>
                </div>
              </div>

              <Button
                onClick={handleLogin}
                disabled={loading || !isPasswordStepValid}
                className="w-full"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <Button
                onClick={() => {
                  setStep("email");
                  setPassword("");
                  setName("");
                  setErrors((prev) => ({ ...prev, name: "", password: "", email: "" }));
                }}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                Use different email
              </Button>
            </div>
          )}

          {/* SUCCESS */}
          {step === "success" && (
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto text-green-500" size={40} />
              <h3>Login Successful</h3>
              <Button onClick={() => setLocation("/")}>
                Go to Dashboard
              </Button>
            </div>
          )}

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
  );
}