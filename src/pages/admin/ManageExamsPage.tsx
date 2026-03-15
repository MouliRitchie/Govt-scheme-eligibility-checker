import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { EDUCATION_LEVELS, type Exam } from "@/lib/constants";

const emptyExam = {
  name: "", description: "", min_age: "", max_age: "",
  eligible_education: "", eligible_gender: "All", subject_requirements: "",
  documents: [] as string[], apply_link: "", official_link: "", steps: [] as string[],
};

export default function ManageExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyExam });
  const [docInput, setDocInput] = useState("");
  const [stepInput, setStepInput] = useState("");
  const { toast } = useToast();

  useEffect(() => { fetchExams(); }, []);

  const fetchExams = async () => {
    const { data } = await supabase.from("exams").select("*").order("created_at", { ascending: false });
    if (data) setExams(data as Exam[]);
  };

  const openNew = () => { setForm({ ...emptyExam }); setEditing(null); setOpen(true); };

  const openEdit = (e: Exam) => {
    setForm({
      name: e.name, description: e.description,
      min_age: e.min_age?.toString() || "", max_age: e.max_age?.toString() || "",
      eligible_education: e.eligible_education || "", eligible_gender: e.eligible_gender || "All",
      subject_requirements: e.subject_requirements || "",
      documents: e.documents || [], apply_link: e.apply_link || "",
      official_link: e.official_link || "", steps: e.steps || [],
    });
    setEditing(e.id); setOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      name: form.name, description: form.description,
      min_age: form.min_age ? parseInt(form.min_age) : null,
      max_age: form.max_age ? parseInt(form.max_age) : null,
      eligible_education: form.eligible_education || null,
      eligible_gender: form.eligible_gender,
      subject_requirements: form.subject_requirements || null,
      documents: form.documents, apply_link: form.apply_link || null,
      official_link: form.official_link || null, steps: form.steps,
    };

    if (editing) {
      const { error } = await supabase.from("exams").update(payload).eq("id", editing);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Exam updated!" });
    } else {
      const { error } = await supabase.from("exams").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Exam added!" });
    }
    setOpen(false); fetchExams();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("exams").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Exam deleted" }); fetchExams();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Manage Exams</h1>
        <Button onClick={openNew} className="gradient-primary text-primary-foreground btn-glow">
          <Plus className="h-4 w-4 mr-2" /> Add New Exam
        </Button>
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Education</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.map(e => (
              <TableRow key={e.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{e.name}</TableCell>
                <TableCell>{e.eligible_education || "Any"}</TableCell>
                <TableCell>{e.eligible_gender}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(e)}><Pencil className="h-3 w-3" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive"><Trash2 className="h-3 w-3" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{e.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(e.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editing ? "Edit Exam" : "Add New Exam"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Exam Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Min Age</Label><Input type="number" value={form.min_age} onChange={e => setForm({ ...form, min_age: e.target.value })} /></div>
              <div><Label>Max Age</Label><Input type="number" value={form.max_age} onChange={e => setForm({ ...form, max_age: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Education Required</Label>
                <Select value={form.eligible_education} onValueChange={v => setForm({ ...form, eligible_education: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{EDUCATION_LEVELS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Eligible Gender</Label>
                <Select value={form.eligible_gender} onValueChange={v => setForm({ ...form, eligible_gender: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Subject Requirements</Label><Input value={form.subject_requirements} onChange={e => setForm({ ...form, subject_requirements: e.target.value })} placeholder="e.g. PCB, PCM, Any" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Apply Link</Label><Input value={form.apply_link} onChange={e => setForm({ ...form, apply_link: e.target.value })} /></div>
              <div><Label>Official Website</Label><Input value={form.official_link} onChange={e => setForm({ ...form, official_link: e.target.value })} /></div>
            </div>

            <div>
              <Label>Required Documents</Label>
              <div className="flex gap-2 mt-1">
                <Input value={docInput} onChange={e => setDocInput(e.target.value)} placeholder="Add document" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (docInput.trim()) { setForm({ ...form, documents: [...form.documents, docInput.trim()] }); setDocInput(""); } } }} />
                <Button type="button" variant="outline" size="sm" onClick={() => { if (docInput.trim()) { setForm({ ...form, documents: [...form.documents, docInput.trim()] }); setDocInput(""); } }}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {form.documents.map((d, i) => (
                  <span key={i} className="bg-muted text-xs px-2 py-1 rounded-full flex items-center gap-1">{d}<button type="button" onClick={() => setForm({ ...form, documents: form.documents.filter((_, j) => j !== i) })}><X className="h-3 w-3" /></button></span>
                ))}
              </div>
            </div>

            <div>
              <Label>Application Steps</Label>
              <div className="flex gap-2 mt-1">
                <Input value={stepInput} onChange={e => setStepInput(e.target.value)} placeholder="Add step" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (stepInput.trim()) { setForm({ ...form, steps: [...form.steps, stepInput.trim()] }); setStepInput(""); } } }} />
                <Button type="button" variant="outline" size="sm" onClick={() => { if (stepInput.trim()) { setForm({ ...form, steps: [...form.steps, stepInput.trim()] }); setStepInput(""); } }}>Add</Button>
              </div>
              <div className="space-y-1 mt-2">
                {form.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs bg-muted px-2 py-1 rounded">
                    <span className="font-bold">{i + 1}.</span> {s}
                    <button type="button" className="ml-auto" onClick={() => setForm({ ...form, steps: form.steps.filter((_, j) => j !== i) })}><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleSave} className="w-full gradient-primary text-primary-foreground btn-glow font-semibold">
              {editing ? "Update Exam" : "Add Exam"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
