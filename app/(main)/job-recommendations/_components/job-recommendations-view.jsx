"use client";

import {
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  CircleAlert,
  CircleCheckBig,
  Filter,
  MapPin,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jobCategories } from "@/data/job-categories";
import { getSafeApplyLink } from "@/lib/job-links";

const categoryTone = {
  high: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  low: "bg-rose-500/10 text-rose-300 border-rose-500/20",
};

const categoryTitle = {
  high: "High Match",
  medium: "Medium Match",
  low: "Low Match",
};

function scoreTone(score) {
  if (score > 70) return "text-emerald-400";
  if (score >= 50) return "text-amber-300";
  return "text-rose-400";
}

function JobApplyAction({ applyLink, label = "Apply Now", variant = "default" }) {
  const safeApplyLink = getSafeApplyLink(applyLink);

  if (!safeApplyLink) return null;

  return (
    <Button variant={variant} asChild>
      <a
        href={safeApplyLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex"
      >
        {label}
        <ArrowUpRight className="ml-2 h-4 w-4" />
      </a>
    </Button>
  );
}

export default function JobRecommendationsView({ user, recommendations }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const liveJobs = recommendations.liveJobs || [];
  const alerts = recommendations.alerts || [];
  const search = recommendations.search || { query: "", category: "all" };
  const apiStatus = recommendations.apiStatus || {
    code: "unknown",
    message: "Live job status is unavailable.",
  };
  const summary = {
    highMatchCount: recommendations?.summary?.highMatchCount ?? recommendations?.categories?.high?.length ?? 0,
    mediumMatchCount:
      recommendations?.summary?.mediumMatchCount ??
      recommendations?.categories?.medium?.length ??
      0,
    lowMatchCount:
      recommendations?.summary?.lowMatchCount ??
      recommendations?.categories?.low?.length ??
      0,
  };

  const jobs = useMemo(() => {
    if (activeCategory === "all") return recommendations.jobs;
    return recommendations.jobs.filter((job) => job.category === activeCategory);
  }, [activeCategory, recommendations.jobs]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <CardContent className="p-6 space-y-6">
            <Badge className="rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 hover:bg-cyan-500/10">
              Skill-based recommendation engine
            </Badge>

            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Recommended jobs based on your current skills
              </h2>
              <p className="max-w-2xl text-slate-300">
                Placenius compares your saved skills against job requirements,
                ranks the strongest matches, and highlights which skills you
                still need before applying.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Profile</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {user.name || "Student"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Skill Count</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {user.skills?.length || 0}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">High Matches</p>
                <p className="mt-2 text-lg font-semibold text-emerald-300">
                  {recommendations.categories.high.length}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Total Jobs</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {recommendations.totalJobs}
                </p>
              </div>
            </div>

            {alerts.length > 0 && (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-emerald-200 font-medium">
                    <Bell className="h-4 w-4" />
                    New high match job found
                  </div>
                  <Badge className="rounded-full bg-emerald-500 text-slate-950 hover:bg-emerald-500">
                    {alerts.length} alert{alerts.length > 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="mt-3 space-y-2">
                  {alerts.slice(0, 2).map((alert) => (
                    <div
                      key={alert.id}
                      className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-100"
                    >
                      <div>
                        <span className="font-medium">{alert.title}</span>
                        <span className="text-slate-300"> at {alert.company}</span>
                        <span className="ml-2 text-emerald-200">
                          {alert.matchPercentage}% match
                        </span>
                      </div>
                      <div className="mt-3">
                        <JobApplyAction
                          applyLink={alert.applyLink}
                          label="Open alert"
                          variant="outline"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4">
              <div className="flex items-center gap-2 text-cyan-200 font-medium">
                <Sparkles className="h-4 w-4" />
                Your current skills
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(user.skills || []).map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="border-cyan-300/20 bg-white/5 text-slate-100"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Match Summary</CardTitle>
            <CardDescription>
              Category distribution of your current recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>High Match</span>
                  <span>{summary.highMatchCount}</span>
                </div>
                <Progress
                  value={
                    recommendations.totalJobs
                      ? (summary.highMatchCount / recommendations.totalJobs) * 100
                      : 0
                  }
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Medium Match</span>
                  <span>{summary.mediumMatchCount}</span>
                </div>
                <Progress
                  value={
                    recommendations.totalJobs
                      ? (summary.mediumMatchCount / recommendations.totalJobs) *
                        100
                      : 0
                  }
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Low Match</span>
                  <span>{summary.lowMatchCount}</span>
                </div>
                <Progress
                  value={
                    recommendations.totalJobs
                      ? (summary.lowMatchCount / recommendations.totalJobs) * 100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </div>

            <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
              High match jobs mean you already satisfy most required skills.
              Medium match jobs need targeted upskilling. Low match jobs help
              you understand which roles are still far from your current stack.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Live Jobs</CardTitle>
          <CardDescription>
            Search JSearch results from RapidAPI. Admin jobs remain the primary
            curated recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-[1fr_240px_auto]" method="GET">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="query"
                defaultValue={search.query}
                placeholder="Search role, skill, or company"
                className="pl-9"
              />
            </div>
            <select
              name="category"
              defaultValue={search.category || "all"}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All categories</option>
              {jobCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search Jobs
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mr-2">
          <Filter className="h-4 w-4" />
          Filter jobs
        </div>
        {["all", "high", "medium", "low"].map((item) => (
          <Button
            key={item}
            type="button"
            size="sm"
            variant={activeCategory === item ? "default" : "outline"}
            onClick={() => setActiveCategory(item)}
            className="capitalize"
          >
            {item === "all" ? "All Jobs" : categoryTitle[item]}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {jobs.map((job) => (
          <Card key={`${job.company}-${job.title}`}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BriefcaseBusiness className="h-5 w-5 text-cyan-400" />
                    {job.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {job.company}
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={categoryTone[job.category]}
                >
                  {categoryTitle[job.category]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  Match percentage
                </div>
                <div className={`text-2xl font-bold ${scoreTone(job.matchPercentage)}`}>
                  {job.matchPercentage}%
                </div>
              </div>
              <Progress value={job.matchPercentage} className="h-2.5" />

              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CircleCheckBig className="h-4 w-4 text-emerald-400" />
                  Required skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CircleAlert className="h-4 w-4 text-amber-400" />
                  Missing skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.missingSkills.length ? (
                    job.missingSkills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <Badge className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/10">
                      Strong fit - no major skill gap
                    </Badge>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <JobApplyAction applyLink={job.applyLink} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!jobs.length && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No jobs found for this filter yet.
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Live Jobs (API)</h2>
            <p className="text-sm text-muted-foreground">
              Fresh API jobs are secondary to your curated Placenius jobs and
              limited for performance.
            </p>
          </div>
          {liveJobs.length > 0 && (
            <Badge variant="outline">{liveJobs.length} live results</Badge>
          )}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {liveJobs.map((job) => (
            <Card key={`live-${job.company}-${job.title}-${job.applyLink}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BriefcaseBusiness className="h-5 w-5 text-cyan-400" />
                      {job.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {job.company}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={categoryTone[job.category]}>
                    {categoryTitle[job.category]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.location || "Location not listed"}
                  </span>
                  <Badge variant="secondary">{job.type || "Not specified"}</Badge>
                  <Badge variant="outline">{job.matchPercentage}% match</Badge>
                </div>
                {job.description && (
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {job.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {(job.requiredSkills || []).length ? (
                    job.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">Skills not listed by API</Badge>
                  )}
                </div>
                <JobApplyAction
                  applyLink={job.applyLink}
                  label="View Live Job"
                  variant="outline"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {!liveJobs.length && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              {apiStatus.code === "forbidden"
                ? "RapidAPI rejected this key or the JSearch subscription is not active. Check the JSearch API subscription in RapidAPI."
                : apiStatus.code === "rate_limited"
                  ? "RapidAPI rate limit reached. Wait for the quota to reset or upgrade the JSearch plan."
                  : apiStatus.code === "missing_key"
                    ? "No RapidAPI key found on the server. Add RAPIDAPI_KEY to .env and restart Next.js."
                    : apiStatus.message || "No live API jobs found yet. Try a broader search."}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
