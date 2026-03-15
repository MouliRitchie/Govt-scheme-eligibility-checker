import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Check admin role
    if (data.user) {
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
      const isAdmin = roles?.some(r => r.role === "admin");
      if (!isAdmin) {
        await supabase.auth.signOut();
        toast({ title: "Access denied", description: "You are not an admin.", variant: "destructive" });
        setLoading(false);
        return;
      }
      navigate("/admin/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-md p-8">
        <h1 className="text-2xl font-display font-bold text-center mb-2 gradient-text">Admin Login</h1>
        <p className="text-center text-muted-foreground text-sm mb-6">SchemeSeva Administration</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground btn-glow font-semibold">
            {loading ? "Signing in..." : "Login as Admin"}
          </Button>
        </form>
      </div>
    </div>
  );
}
