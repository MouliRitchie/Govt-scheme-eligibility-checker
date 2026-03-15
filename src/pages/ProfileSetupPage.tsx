import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { INDIAN_STATES, CATEGORIES, GENDERS, INCOME_RANGES, EDUCATION_LEVELS, EMPLOYMENT_STATUSES } from "@/lib/constants";
import { Navbar } from "@/components/Navbar";

export default function ProfileSetupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    age: "",
    gender: "",
    state: "",
    category: "",
    income: "",
    education: "",
    employment: "",
  });

  const filledFields = Object.values(form).filter(v => v !== "").length;
  const progress = (filledFields / 7) * 100;

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update({
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender || null,
      state: form.state || null,
      category: form.category || null,
      income: form.income || null,
      education: form.education || null,
      employment: form.employment || null,
      profile_completed: true,
    }).eq("id", user.id);
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile saved!" });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="authenticated" />
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-2xl font-display font-bold mb-2 gradient-text">Complete Your Profile</h1>
        <p className="text-muted-foreground text-sm mb-6">Help us find the best schemes and exams for you.</p>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Profile Completion</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="glass-card p-6 space-y-4">
          <div>
            <Label>Age</Label>
            <Input type="number" min={1} max={120} value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="Enter your age" />
          </div>

          <div>
            <Label>Gender</Label>
            <Select value={form.gender} onValueChange={v => setForm({ ...form, gender: v })}>
              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                {GENDERS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>State</Label>
            <Select value={form.state} onValueChange={v => setForm({ ...form, state: v })}>
              <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Annual Income</Label>
            <Select value={form.income} onValueChange={v => setForm({ ...form, income: v })}>
              <SelectTrigger><SelectValue placeholder="Select income range" /></SelectTrigger>
              <SelectContent>
                {INCOME_RANGES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Education Level</Label>
            <Select value={form.education} onValueChange={v => setForm({ ...form, education: v })}>
              <SelectTrigger><SelectValue placeholder="Select education" /></SelectTrigger>
              <SelectContent>
                {EDUCATION_LEVELS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Employment Status</Label>
            <Select value={form.employment} onValueChange={v => setForm({ ...form, employment: v })}>
              <SelectTrigger><SelectValue placeholder="Select employment status" /></SelectTrigger>
              <SelectContent>
                {EMPLOYMENT_STATUSES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} disabled={loading} className="w-full gradient-primary text-primary-foreground btn-glow font-semibold">
            {loading ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
