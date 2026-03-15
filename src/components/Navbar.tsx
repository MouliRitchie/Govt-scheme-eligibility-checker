import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  variant?: "public" | "authenticated";
}

export function Navbar({ variant = "public" }: NavbarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="gradient-primary sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-extrabold text-primary-foreground tracking-tight">
            SchemeSeva
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {variant === "public" && !user && (
            <>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary/20" onClick={() => navigate("/admin/login")}>
                Admin
              </Button>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary/20" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold" onClick={() => navigate("/register")}>
                Register
              </Button>
            </>
          )}
          {user && variant === "authenticated" && (
            <>
              <Link to="/dashboard" className="text-primary-foreground hover:opacity-80 font-medium text-sm">Dashboard</Link>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/20" onClick={() => navigate("/profile")}>
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/20" onClick={() => { signOut(); navigate("/"); }}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-primary-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden gradient-primary border-t border-primary/30 px-4 py-3 flex flex-col gap-2">
          <ThemeToggle />
          {variant === "public" && !user && (
            <>
              <Button variant="ghost" className="text-primary-foreground justify-start" onClick={() => { navigate("/admin/login"); setMobileOpen(false); }}>Admin</Button>
              <Button variant="ghost" className="text-primary-foreground justify-start" onClick={() => { navigate("/login"); setMobileOpen(false); }}>Login</Button>
              <Button className="bg-primary-foreground text-primary justify-start" onClick={() => { navigate("/register"); setMobileOpen(false); }}>Register</Button>
            </>
          )}
          {user && variant === "authenticated" && (
            <>
              <Button variant="ghost" className="text-primary-foreground justify-start" onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}>Dashboard</Button>
              <Button variant="ghost" className="text-primary-foreground justify-start" onClick={() => { signOut(); navigate("/"); setMobileOpen(false); }}>Logout</Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
