import { useState } from "react";
import { useLocation } from "wouter";
import { Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/context/auth-context";

interface ProtectedFeatureProps {
  children: React.ReactNode;
  featureName: string;
  description?: string;
  requiresLogin?: boolean;
}

export function ProtectedFeature({
  children,
  featureName,
  description,
  requiresLogin = true,
}: ProtectedFeatureProps) {
  const { isLoggedIn } = useAuth();
  const [, navigate] = useLocation();
  const [showPrompt, setShowPrompt] = useState(!isLoggedIn && requiresLogin);

  if (!isLoggedIn && requiresLogin) {
    return (
      <>
        <div className="opacity-50 pointer-events-none blur-sm">{children}</div>
        <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Unlock {featureName}
                </DialogTitle>
              </div>
              <DialogDescription>
                {description ||
                  `Sign in to access ${featureName} and save your preferences. Unlock the full potential of our platform!`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm">Limited Preview Mode</h4>
                <p className="text-sm text-muted-foreground">
                  You're viewing a limited preview. Login to:
                </p>
                <ul className="text-sm space-y-1 ml-2">
                  <li>✓ Save your favorite items</li>
                  <li>✓ Connect with artisans</li>
                  <li>✓ View personalized recommendations</li>
                  <li>✓ Manage your orders</li>
                </ul>
              </div>

              <div className="flex gap-2 flex-col">
                <Button
                  onClick={() => {
                    setShowPrompt(false);
                    navigate("/customer-login");
                  }}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Login as Customer
                </Button>
                <Button
                  onClick={() => {
                    setShowPrompt(false);
                    navigate("/artisan-login");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Login as Artisan
                </Button>
                <Button
                  onClick={() => {
                    setShowPrompt(false);
                    navigate("/auth");
                  }}
                  variant="ghost"
                  className="w-full"
                >
                  New? Sign Up
                </Button>
              </div>

              <button
                onClick={() => setShowPrompt(false)}
                className="w-full text-sm text-muted-foreground hover:text-foreground smooth-transition"
              >
                Continue exploring
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return children;
}
