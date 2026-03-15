import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, UserPlus, CheckCircle, ArrowRight } from "lucide-react";

const stats = [
  { label: "Schemes", value: "20+" },
  { label: "Exams", value: "10+" },
  { label: "Cost", value: "Free Forever" },
  { label: "Trusted by", value: "Thousands" },
];

const steps = [
  { icon: UserPlus, title: "Register", desc: "Create your free account in seconds" },
  { icon: Search, title: "Fill Your Profile", desc: "Tell us about yourself — age, education, income" },
  { icon: CheckCircle, title: "Get Matched Instantly", desc: "See every scheme and exam you qualify for" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar variant="public" />

      {/* Hero */}
      <section className="gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.3),transparent_50%)]" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-primary-foreground mb-6 leading-tight"
          >
            Discover Government Benefits
            <br />
            <span className="opacity-90">Made For You</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-8"
          >
            Answer a few questions and instantly find all government schemes and exams you qualify for
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-display font-bold text-lg px-8 py-6 rounded-xl btn-glow"
              onClick={() => navigate("/register")}
            >
              Check Your Eligibility <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-8 z-20 px-4">
        <div className="container mx-auto">
          <div className="glass-card p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="text-center"
              >
                <p className="text-2xl md:text-3xl font-display font-extrabold gradient-text">{stat.value}</p>
                <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-12 gradient-text">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 * i }}
                className="glass-card hover-lift p-8 text-center"
              >
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5">
                  <step.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Step {i + 1}</p>
                <h3 className="text-lg font-display font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gradient-primary mt-auto py-8 px-4">
        <div className="container mx-auto text-center text-primary-foreground/70 text-sm">
          <p className="font-display font-bold text-primary-foreground text-lg mb-2">SchemeSeva</p>
          <p>© {new Date().getFullYear()} SchemeSeva. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <span className="hover:text-primary-foreground cursor-pointer" onClick={() => navigate("/admin/login")}>Admin Login</span>
            <span className="hover:text-primary-foreground cursor-pointer">About</span>
            <span className="hover:text-primary-foreground cursor-pointer">Contact</span>
            <span className="hover:text-primary-foreground cursor-pointer">Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
