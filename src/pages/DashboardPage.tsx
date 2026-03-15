import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { SchemeCard } from "@/components/SchemeCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Profile, Scheme, Exam, checkSchemeEligibility, checkExamEligibility, SCHEME_CATEGORIES } from "@/lib/constants";
import { useNavigate, Link } from "react-router-dom";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [bookmarks, setBookmarks] = useState<{ scheme_id: string | null; exam_id: string | null }[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    if (user) fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    if (!user) return;
    const [profileRes, schemesRes, examsRes, bookmarksRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("schemes").select("*"),
      supabase.from("exams").select("*"),
      supabase.from("bookmarks").select("scheme_id, exam_id").eq("user_id", user.id),
    ]);
    if (profileRes.data) setProfile(profileRes.data as Profile);
    if (schemesRes.data) setSchemes(schemesRes.data as Scheme[]);
    if (examsRes.data) setExams(examsRes.data as Exam[]);
    if (bookmarksRes.data) setBookmarks(bookmarksRes.data);
    setLoading(false);
  };

  const toggleBookmark = async (type: "scheme" | "exam", id: string) => {
    if (!user) return;
    const field = type === "scheme" ? "scheme_id" : "exam_id";
    const existing = bookmarks.find(b => b[field] === id);
    if (existing) {
      await supabase.from("bookmarks").delete().eq("user_id", user.id).eq(field, id);
      setBookmarks(bookmarks.filter(b => b[field] !== id));
    } else {
      const newBookmark = { user_id: user.id, [field]: id };
      await supabase.from("bookmarks").insert(newBookmark);
      setBookmarks([...bookmarks, { scheme_id: type === "scheme" ? id : null, exam_id: type === "exam" ? id : null }]);
    }
  };

  const filteredSchemes = schemes.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || s.category === category;
    const eligible = profile ? checkSchemeEligibility(profile, s) : false;
    return matchSearch && matchCat && (showAll || eligible);
  });

  const filteredExams = exams.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const eligible = profile ? checkExamEligibility(profile, e) : false;
    return matchSearch && (showAll || eligible);
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="authenticated" />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-display font-bold mb-1">
          Welcome back, <span className="gradient-text">{profile?.name || "User"}</span>!
        </h1>
        <p className="text-muted-foreground text-sm mb-6">Find schemes and exams tailored to your profile.</p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search schemes or exams..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {SCHEME_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch id="show-all" checked={showAll} onCheckedChange={setShowAll} />
            <Label htmlFor="show-all" className="text-sm whitespace-nowrap">Show All</Label>
          </div>
        </div>

        <Tabs defaultValue="schemes">
          <TabsList className="mb-4">
            <TabsTrigger value="schemes">Schemes ({filteredSchemes.length})</TabsTrigger>
            <TabsTrigger value="exams">Exams ({filteredExams.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="schemes">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSchemes.map(s => (
                <SchemeCard
                  key={s.id}
                  id={s.id}
                  name={s.name}
                  description={s.description}
                  category={s.category}
                  eligible={profile ? checkSchemeEligibility(profile, s) : false}
                  eligibleCount={s.eligible_count}
                  isBookmarked={bookmarks.some(b => b.scheme_id === s.id)}
                  onToggleBookmark={() => toggleBookmark("scheme", s.id)}
                  type="scheme"
                />
              ))}
              {filteredSchemes.length === 0 && (
                <div className="col-span-full text-center py-16 px-4 glass-card border-dashed">
                  <p className="text-muted-foreground mb-4">
                    {showAll 
                      ? "No schemes found matching your search." 
                      : "No eligible schemes found for your profile yet."}
                  </p>
                  {!showAll && (
                    <div className="space-y-4">
                      <p className="text-sm text-primary font-medium">Want to see every scheme?</p>
                      <Button variant="outline" size="sm" onClick={() => setShowAll(true)}>
                        Toggle "Show All" to explore
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Or <Link to="/profile-setup" className="underline hover:text-primary">complete your profile</Link> to get better matches.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="exams">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExams.map(e => (
                <SchemeCard
                  key={e.id}
                  id={e.id}
                  name={e.name}
                  description={e.description}
                  category="Education"
                  eligible={profile ? checkExamEligibility(profile, e) : false}
                  isBookmarked={bookmarks.some(b => b.exam_id === e.id)}
                  onToggleBookmark={() => toggleBookmark("exam", e.id)}
                  type="exam"
                />
              ))}
              {filteredExams.length === 0 && (
                <div className="col-span-full text-center py-16 px-4 glass-card border-dashed">
                  <p className="text-muted-foreground mb-4">
                    {showAll 
                      ? "No exams found matching your search." 
                      : "No eligible exams found for your profile yet."}
                  </p>
                  {!showAll && (
                    <div className="space-y-4">
                      <p className="text-sm text-primary font-medium">Want to see all exams?</p>
                      <Button variant="outline" size="sm" onClick={() => setShowAll(true)}>
                        Toggle "Show All" to explore
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Or <Link to="/profile-setup" className="underline hover:text-primary">complete your profile</Link> to get better matches.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
