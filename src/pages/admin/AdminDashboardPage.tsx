import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { FileText, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({ schemes: 0, exams: 0, users: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("schemes").select("id", { count: "exact", head: true }),
      supabase.from("exams").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
    ]).then(([s, e, u]) => {
      setCounts({
        schemes: s.count || 0,
        exams: e.count || 0,
        users: u.count || 0,
      });
    });
  }, []);

  const cards = [
    { label: "Total Schemes", value: counts.schemes, icon: FileText, color: "cat-education" },
    { label: "Total Exams", value: counts.exams, icon: GraduationCap, color: "cat-health" },
    { label: "Total Users", value: counts.users, icon: Users, color: "cat-finance" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-display font-bold mb-6">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {cards.map(card => (
          <div key={card.label} className="glass-card hover-lift p-6">
            <div className="flex items-center justify-between mb-4">
              <span className={`${card.color} p-3 rounded-xl`}>
                <card.icon className="h-6 w-6" />
              </span>
            </div>
            <p className="text-3xl font-display font-bold">{card.value}</p>
            <p className="text-muted-foreground text-sm">{card.label}</p>
          </div>
        ))}
      </div>

      {(counts.schemes === 0 || counts.exams === 0) && (
        <div className="mt-12 glass-card p-8 text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-display font-bold mb-3">Get Started</h2>
          <p className="text-muted-foreground mb-6">It looks like you don't have any schemes or exams in your database yet. Start by adding some to populate the dashboard.</p>
          <div className="flex gap-4 justify-center">
            <Button asChild className="gradient-primary text-primary-foreground">
              <Link to="/admin/schemes">Manage Schemes</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/exams">Manage Exams</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
