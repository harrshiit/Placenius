"use client";

import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  Link2,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialFormState = {
  id: null,
  applyLink: "",
  role: "Frontend",
  skills: [],
  type: "Internship",
  location: "Remote",
  title: "",
  company: "",
};

function normalizeJobForEdit(job) {
  return {
    id: job.id,
    applyLink: job.applyLink || "",
    role: job.role || "Frontend",
    skills: job.skills || job.requiredSkills || [],
    type: job.type || "Internship",
    location: job.location || "Remote",
    title: job.title || "",
    company: job.company || "",
  };
}

export default function AdminJobsPanel({
  initialJobs,
  skillOptions,
  roleOptions,
  jobTypeOptions,
  locationOptions,
}) {
  const [jobs, setJobs] = useState(initialJobs);
  const [form, setForm] = useState(initialFormState);
  const [skillQuery, setSkillQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });

  const editing = Boolean(form.id);

  const filteredSkillOptions = useMemo(() => {
    return skillOptions.filter((skill) => {
      if (form.skills.includes(skill)) return false;
      if (!skillQuery.trim()) return true;
      return skill.toLowerCase().includes(skillQuery.toLowerCase());
    });
  }, [form.skills, skillOptions, skillQuery]);

  const resetForm = () => {
    setForm(initialFormState);
    setSkillQuery("");
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const addSkill = (skill) => {
    setForm((current) => ({
      ...current,
      skills: current.skills.includes(skill)
        ? current.skills
        : [...current.skills, skill],
    }));
  };

  const removeSkill = (skill) => {
    setForm((current) => ({
      ...current,
      skills: current.skills.filter((item) => item !== skill),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    const method = editing ? "PUT" : "POST";
    const endpoint = editing ? `/api/admin/jobs/${form.id}` : "/api/admin/jobs";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applyLink: form.applyLink,
          role: form.role,
          skills: form.skills,
          type: form.type,
          location: form.location,
          title: form.title,
          company: form.company,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to save job.");
      }

      if (editing) {
        setJobs((current) =>
          current.map((job) => (job.id === payload.job.id ? payload.job : job))
        );
        setStatus({ type: "success", message: "Job updated successfully." });
      } else {
        setJobs((current) => [payload.job, ...current]);
        setStatus({ type: "success", message: "Job added successfully." });
      }

      resetForm();
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong while saving the job.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm(
      "Delete this curated job? This action cannot be undone."
    );

    if (!confirmed) return;

    setIsDeletingId(jobId);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to delete job.");
      }

      setJobs((current) => current.filter((job) => job.id !== jobId));

      if (form.id === jobId) {
        resetForm();
      }

      setStatus({ type: "success", message: "Job deleted successfully." });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong while deleting the job.",
      });
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Badge className="rounded-full border border-cyan-400/20 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/10">
                Secure admin-only operations
              </Badge>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Placenius curated job admin panel
                </h1>
                <p className="mt-2 max-w-3xl text-slate-300">
                  Add trusted job links, map the right skill stack, and keep the
                  recommendation engine updated without disturbing the rest of
                  the product flow.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Curated Jobs</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {jobs.length}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Primary Input</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Link + skills
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Access
                </div>
                <p className="mt-2 text-lg font-semibold text-emerald-300">
                  Admin verified
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {status.message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
              : "border-rose-500/20 bg-rose-500/10 text-rose-200"
          }`}
        >
          {status.message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Edit curated job" : "Add curated job"}</CardTitle>
            <CardDescription>
              Paste the job link first. If title or company is left empty, Placenius
              will infer them from the URL when possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="applyLink">Paste job link</Label>
                <div className="relative">
                  <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="applyLink"
                    value={form.applyLink}
                    onChange={(event) => updateField("applyLink", event.target.value)}
                    placeholder="https://company.com/careers/frontend-intern"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={form.role}
                    onValueChange={(value) => updateField("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Job type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value) => updateField("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypeOptions.map((jobType) => (
                        <SelectItem key={jobType} value={jobType}>
                          {jobType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title (optional)</Label>
                  <div className="relative">
                    <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(event) => updateField("title", event.target.value)}
                      placeholder="Frontend Developer Intern"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company (optional)</Label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="company"
                      value={form.company}
                      onChange={(event) => updateField("company", event.target.value)}
                      placeholder="Acme Labs"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Select
                  value={form.location}
                  onValueChange={(value) => updateField("location", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label>Skills</Label>
                    <p className="text-sm text-muted-foreground">
                      Pick the required skills you want the matcher to compare against.
                    </p>
                  </div>
                  <Badge variant="outline">{form.skills.length} selected</Badge>
                </div>

                <Input
                  value={skillQuery}
                  onChange={(event) => setSkillQuery(event.target.value)}
                  placeholder="Search skills like React, SQL, Docker..."
                />

                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill) => (
                    <Button
                      key={skill}
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeSkill(skill)}
                      className="h-8"
                    >
                      {skill}
                      <X className="ml-1 h-3 w-3" />
                    </Button>
                  ))}
                </div>

                <div className="max-h-44 overflow-y-auto rounded-2xl border bg-muted/20 p-3">
                  <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5" />
                    Available skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filteredSkillOptions.slice(0, 48).map((skill) => (
                      <Button
                        key={skill}
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => addSkill(skill)}
                        className="h-8 border border-border bg-background"
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : editing ? (
                    <Save className="mr-2 h-4 w-4" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  {editing ? "Update Job" : "Add Job"}
                </Button>

                {editing ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setStatus({ type: "", message: "" });
                    }}
                  >
                    Cancel Edit
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Curated job list</CardTitle>
            <CardDescription>
              These jobs are merged into Placenius recommendations ahead of the fallback mock dataset.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {jobs.length ? (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border bg-card/60 p-4 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <Badge variant="outline">{job.role}</Badge>
                        <Badge variant="secondary">{job.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setForm(normalizeJobForEdit(job));
                          setStatus({ type: "", message: "" });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <Pencil className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(job.id)}
                        disabled={isDeletingId === job.id}
                      >
                        {isDeletingId === job.id ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-1 h-4 w-4" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(job.skills || []).map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 break-all">
                      <Link2 className="h-4 w-4" />
                      <a
                        href={job.applyLink}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-cyan-300 hover:text-cyan-200"
                      >
                        {job.applyLink}
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
                No curated jobs yet. Add the first one from the form and it will
                immediately start feeding the recommendation engine.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
