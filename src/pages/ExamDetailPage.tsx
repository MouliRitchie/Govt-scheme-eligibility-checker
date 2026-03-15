import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { type Exam } from "@/lib/constants";

export default function ExamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [checkedDocs, setCheckedDocs] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (id) {
      supabase.from("exams").select("*").eq("id", id).single()
        .then(({ data }) => { if (data) setExam(data as Exam); });
    }
  }, [id]);

  if (!exam) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="authenticated" />
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="glass-card p-6 md:p-8">
          <h1 className="text-2xl font-display font-bold mb-3">{exam.name}</h1>
          <p className="text-muted-foreground mb-6">{exam.description}</p>

          <div className="mb-6">
            <h2 className="font-display font-bold text-lg mb-3">Eligibility Criteria</h2>
            <ul className="space-y-1 text-sm">
              {exam.min_age && <li>• Minimum age: {exam.min_age}</li>}
              {exam.max_age && <li>• Maximum age: {exam.max_age}</li>}
              {exam.eligible_gender && exam.eligible_gender !== "All" && <li>• Gender: {exam.eligible_gender}</li>}
              {exam.eligible_education && <li>• Education: {exam.eligible_education}</li>}
              {exam.subject_requirements && <li>• Subjects: {exam.subject_requirements}</li>}
            </ul>
          </div>

          {exam.documents && exam.documents.length > 0 && (
            <div className="mb-6">
              <h2 className="font-display font-bold text-lg mb-3">Required Documents</h2>
              <div className="space-y-2">
                {exam.documents.map((doc, i) => (
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

          {exam.steps && exam.steps.length > 0 && (
            <div className="mb-6">
              <h2 className="font-display font-bold text-lg mb-3">Application Steps</h2>
              <div className="space-y-3">
                {exam.steps.map((step, i) => (
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

          <div className="flex gap-3">
            {exam.apply_link && (
              <Button asChild className="gradient-primary text-primary-foreground btn-glow font-semibold">
                <a href={exam.apply_link} target="_blank" rel="noopener noreferrer">
                  Apply Now <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            )}
            {exam.official_link && (
              <Button asChild variant="outline">
                <a href={exam.official_link} target="_blank" rel="noopener noreferrer">
                  Official Website <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
