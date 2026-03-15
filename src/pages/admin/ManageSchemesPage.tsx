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
import { SCHEME_CATEGORIES, INCOME_RANGES, EDUCATION_LEVELS, EMPLOYMENT_STATUSES, CATEGORIES, type Scheme } from "@/lib/constants";

const emptyScheme = {
  name: "", description: "", category: "Education", min_age: "", max_age: "",
  max_income: "", eligible_categories: [] as string[], eligible_gender: "All",
  min_education: "", employment: "All", documents: [] as string[],
  apply_link: "", eligible_count: "", deadline: "", steps: [] as string[],
};

export default function ManageSchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyScheme });
  const [docInput, setDocInput] = useState("");
  const [stepInput, setStepInput] = useState("");
  const { toast } = useToast();

  useEffect(() => { fetchSchemes(); }, []);

  const fetchSchemes = async () => {
    const { data } = await supabase.from("schemes").select("*").order("created_at", { ascending: false });
    if (data) setSchemes(data as Scheme[]);
  };

  const openNew = () => {
    setForm({ ...emptyScheme });
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (s: Scheme) => {
    setForm({
      name: s.name,
      description: s.description,
      category: s.category,
      min_age: s.min_age?.toString() || "",
      max_age: s.max_age?.toString() || "",
      max_income: s.max_income || "",
      eligible_categories: s.eligible_categories || [],
      eligible_gender: s.eligible_gender || "All",
      min_education: s.min_education || "",
      employment: s.employment || "All",
      documents: s.documents || [],
      apply_link: s.apply_link || "",
      eligible_count: s.eligible_count || "",
      deadline: s.deadline || "",
      steps: s.steps || [],
    });
    setEditing(s.id);
    setOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      min_age: form.min_age ? parseInt(form.min_age) : null,
      max_age: form.max_age ? parseInt(form.max_age) : null,
      max_income: form.max_income || null,
      eligible_categories: form.eligible_categories,
      eligible_gender: form.eligible_gender,
      min_education: form.min_education || null,
      employment: form.employment,
      documents: form.documents,
      apply_link: form.apply_link || null,
      eligible_count: form.eligible_count || null,
      deadline: form.deadline || null,
      steps: form.steps,
    };

    if (editing) {
      const { error } = await supabase.from("schemes").update(payload).eq("id", editing);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Scheme updated!" });
    } else {
      const { error } = await supabase.from("schemes").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Scheme added!" });
    }
    setOpen(false);
    fetchSchemes();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("schemes").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Scheme deleted" });
    fetchSchemes();
  };

  const toggleCategory = (cat: string) => {
    setForm(prev => ({
      ...prev,
      eligible_categories: prev.eligible_categories.includes(cat)
        ? prev.eligible_categories.filter(c => c !== cat)
        : [...prev.eligible_categories, cat],
    }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Manage Schemes</h1>
        <Button onClick={openNew} className="gradient-primary text-primary-foreground btn-glow">
          <Plus className="h-4 w-4 mr-2" /> Add New Scheme
        </Button>
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Eligible For</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schemes.map(s => (
              <TableRow key={s.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.category}</TableCell>
                <TableCell className="text-sm">{s.eligible_gender === "All" ? "All genders" : s.eligible_gender}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(s)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive"><Trash2 className="h-3 w-3" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{s.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(s.id)}>Delete</AlertDialogAction>
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
            <DialogTitle className="font-display">{editing ? "Edit Scheme" : "Add New Scheme"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Scheme Name</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SCHEME_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
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
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Min Age</Label><Input type="number" value={form.min_age} onChange={e => setForm({ ...form, min_age: e.target.value })} /></div>
              <div><Label>Max Age</Label><Input type="number" value={form.max_age} onChange={e => setForm({ ...form, max_age: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Max Annual Income</Label>
                <Select value={form.max_income} onValueChange={v => setForm({ ...form, max_income: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{INCOME_RANGES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Min Education</Label>
                <Select value={form.min_education} onValueChange={v => setForm({ ...form, min_education: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    {EDUCATION_LEVELS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employment Status</Label>
                <Select value={form.employment} onValueChange={v => setForm({ ...form, employment: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {EMPLOYMENT_STATUSES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Deadline</Label>
                <Input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
              </div>
            </div>

            <div>
              <Label>Eligible Categories</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      form.eligible_categories.includes(cat)
                        ? "gradient-primary text-primary-foreground border-transparent"
                        : "border-border text-muted-foreground hover:border-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><Label>Apply Link</Label><Input value={form.apply_link} onChange={e => setForm({ ...form, apply_link: e.target.value })} /></div>
              <div><Label>Eligible Count</Label><Input value={form.eligible_count} onChange={e => setForm({ ...form, eligible_count: e.target.value })} placeholder="e.g. 11 Crore" /></div>
            </div>

            <div>
              <Label>Required Documents</Label>
              <div className="flex gap-2 mt-1">
                <Input value={docInput} onChange={e => setDocInput(e.target.value)} placeholder="Add document" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (docInput.trim()) { setForm({ ...form, documents: [...form.documents, docInput.trim()] }); setDocInput(""); } } }} />
                <Button type="button" variant="outline" size="sm" onClick={() => { if (docInput.trim()) { setForm({ ...form, documents: [...form.documents, docInput.trim()] }); setDocInput(""); } }}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {form.documents.map((d, i) => (
                  <span key={i} className="bg-muted text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    {d}
                    <button type="button" onClick={() => setForm({ ...form, documents: form.documents.filter((_, j) => j !== i) })}><X className="h-3 w-3" /></button>
                  </span>
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
              {editing ? "Update Scheme" : "Add Scheme"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
