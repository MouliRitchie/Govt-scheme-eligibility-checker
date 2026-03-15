import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ExternalLink, Calendar, CheckCircle2 } from "lucide-react";
import { CATEGORY_COLORS, type Scheme } from "@/lib/constants";

export default function SchemeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [checkedDocs, setCheckedDocs] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (id) {
      supabase.from("schemes").select("*").eq("id", id).single()
        .then(({ data }) => { if (data) setScheme(data as Scheme); });
    }
  }, [id]);

  if (!scheme) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const catClass = CATEGORY_COLORS[scheme.category] || "cat-education";

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="authenticated" />
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="glass-card p-6 md:p-8">
          <div className="flex items-start gap-3 mb-4 flex-wrap">
            <span className={`${catClass} text-xs font-semibold px-3 py-1 rounded-full`}>{scheme.category}</span>
            {scheme.deadline && (
              <Badge variant="outline" className="text-xs"><Calendar className="h-3 w-3 mr-1" /> Deadline: {new Date(scheme.deadline).toLocaleDateString()}</Badge>
            )}
            {scheme.eligible_count && (
              <Badge variant="secondary" className="text-xs">{scheme.eligible_count} eligible</Badge>
            )}
          </div>

          <h1 className="text-2xl font-display font-bold mb-3">{scheme.name}</h1>
          <p className="text-muted-foreground mb-6">{scheme.description}</p>

          {/* Eligibility Criteria */}
          <div className="mb-6">
            <h2 className="font-display font-bold text-lg mb-3">Eligibility Criteria</h2>
            <ul className="space-y-1 text-sm">
              {scheme.min_age && <li>• Minimum age: {scheme.min_age}</li>}
              {scheme.max_age && <li>• Maximum age: {scheme.max_age}</li>}
              {scheme.eligible_gender && scheme.eligible_gender !== "All" && <li>• Gender: {scheme.eligible_gender}</li>}
              {scheme.eligible_categories && scheme.eligible_categories.length > 0 && <li>• Categories: {scheme.eligible_categories.join(", ")}</li>}
              {scheme.max_income && <li>• Max income: {scheme.max_income}</li>}
              {scheme.min_education && <li>• Min education: {scheme.min_education}</li>}
              {scheme.employment && scheme.employment !== "All" && <li>• Employment: {scheme.employment}</li>}
            </ul>
          </div>

          {/* Documents */}
          {scheme.documents && scheme.documents.length > 0 && (
            <div className="mb-6">
              <h2 className="font-display font-bold text-lg mb-3">Required Documents</h2>
              <div className="space-y-2">
                {scheme.documents.map((doc, i) => (
                  <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={checkedDocs.has(i)} onCheckedChange={(checked) => {
                      const next = new Set(checkedDocs);
                      if (checked) { next.add(i); } else { next.delete(i); }
                      setCheckedDocs(next);
                    }} />
                    <span className={checkedDocs.has(i) ? "line-through text-muted-foreground" : ""}>{doc}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Steps */}
          {scheme.steps && scheme.steps.length > 0 && (
            <div className="mb-6">
              <h2 className="font-display font-bold text-lg mb-3">Application Steps</h2>
              <div className="space-y-3">
                {scheme.steps.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
                      <span className="text-primary-foreground text-xs font-bold">{i + 1}</span>
                    </div>
                    <p className="text-sm pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {scheme.apply_link && (
            <Button asChild className="gradient-primary text-primary-foreground btn-glow font-semibold">
              <a href={scheme.apply_link} target="_blank" rel="noopener noreferrer">
                Apply Now <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
