import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      // Check if profile is completed
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check for admin role
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
        const isAdmin = roles?.some(r => r.role === "admin");

        if (isAdmin) {
          navigate("/admin/dashboard");
          return;
        }

        const { data: profile } = await supabase.from("profiles").select("profile_completed").eq("id", user.id).single();
        if (profile && !profile.profile_completed) {
          navigate("/profile-setup");
        } else {
          navigate("/dashboard");
        }
      }
    }
  };

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-md p-8">
        <h1 className="text-2xl font-display font-bold text-center mb-6 gradient-text">Welcome Back</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Your password" />
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground btn-glow font-semibold">
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account? <Link to="/register" className="gradient-text font-semibold">Register</Link>
        </p>
        <p className="text-center text-xs text-muted-foreground mt-6 border-t pt-4">
          Are you an admin? <Link to="/admin/login" className="hover:text-primary transition-colors font-medium underline underline-offset-4">Admin login here</Link>
        </p>
      </div>
    </div>
  );
}
