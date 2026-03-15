import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, FileText, GraduationCap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manage Schemes", path: "/admin/schemes", icon: FileText },
  { label: "Manage Exams", path: "/admin/exams", icon: GraduationCap },
];

export default function AdminLayout() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/admin/login"); return; }
    supabase.from("user_roles").select("role").eq("user_id", user.id).then(({ data }) => {
      const admin = data?.some(r => r.role === "admin");
      if (!admin) { navigate("/admin/login"); return; }
      setIsAdmin(true);
    });
  }, [user, authLoading]);

  if (authLoading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 gradient-primary min-h-screen flex flex-col shrink-0">
        <div className="p-6 border-b border-primary-foreground/10">
          <span className="font-display text-lg font-extrabold text-primary-foreground">SchemeSeva Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <Button variant="ghost" className="w-full text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 justify-start" onClick={() => { signOut(); navigate("/admin/login"); }}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-background overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
