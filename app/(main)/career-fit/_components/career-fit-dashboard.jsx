"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Crosshair,
  Filter,
  Layers3,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  WandSparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { analyzeCareerFit } from "@/lib/career-fit";

const scoreTone = (score) => {
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-cyan-400";
  if (score >= 25) return "text-amber-400";
  return "text-rose-400";
};

export default function CareerFitDashboard({ user, analysis }) {
  const [skillQuery, setSkillQuery] = useState("");
  const [extraSkills, setExtraSkills] = useState([]);

  const liveAnalysis = useMemo(
    () =>
      analyzeCareerFit({
        profileSkills: user.skills ?? [],
        resumeContent: user.resumeContent ?? "",
        extraSkills,
      }),
    [extraSkills, user.resumeContent, user.skills]
  );

  const {
    topMatch,
    supportRoles,
    chartData,
    domainResults,
    detectedSkills,
    allCareerSkills,
    overallMomentum,
  } = liveAnalysis;

  const suggestedSkills = allCareerSkills.filter((skill) => {
    if (detectedSkills.includes(skill)) return false;
    if (extraSkills.includes(skill)) return false;
    if (!skillQuery.trim()) return true;
    return skill.toLowerCase().includes(skillQuery.toLowerCase());
  });

  const addSkill = (skill) => {
    setExtraSkills((current) =>
      current.includes(skill) ? current : [...current, skill]
    );
  };

  const removeSkill = (skill) => {
    setExtraSkills((current) => current.filter((item) => item !== skill));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.9fr]">
        <Card className="overflow-hidden border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <CardContent className="p-0">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] p-6">
              <div className="space-y-5">
                <Badge className="rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 hover:bg-cyan-500/10">
                  Resume + manual skill intelligence
                </Badge>
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    You are currently best aligned with{" "}
                    <span className="text-cyan-300">{topMatch.title}</span>
                  </h2>
                  <p className="text-slate-300 max-w-2xl">
                    Placenius studied your onboarding skills, saved resume
                    content, and any extra skills you manually selected to rank
                    your strongest career track.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <Crosshair className="h-4 w-4 text-cyan-300" />
                      Best Match
                    </div>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {topMatch.shortTitle}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <TrendingUp className="h-4 w-4 text-emerald-300" />
                      Overall Score
                    </div>
                    <p
                      className={`mt-2 text-xl font-semibold ${scoreTone(
                        topMatch.score
                      )}`}
                    >
                      {topMatch.score}%
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <Layers3 className="h-4 w-4 text-fuchsia-300" />
                      Skills Found
                    </div>
                    <p className="mt-2 text-xl font-semibold text-white">
                      {detectedSkills.length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <Target className="h-4 w-4 text-amber-300" />
                      Momentum
                    </div>
                    <p className="mt-2 text-xl font-semibold text-white">
                      {overallMomentum}%
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4">
                  <div className="flex items-center gap-2 text-cyan-200 font-medium">
                    <Sparkles className="h-4 w-4" />
                    What to learn next for {topMatch.shortTitle}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {topMatch.nextSkills.length ? (
                      topMatch.nextSkills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="border-cyan-300/20 bg-white/5 text-slate-100"
                        >
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
                      >
                        Strong foundation already built
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-cyan-950/20">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      Match Breakdown
                    </p>
                    <p className="text-white font-semibold mt-2">
                      {user.name || "Your Profile"}
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300">
                    {topMatch.readinessLabel}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {domainResults.slice(0, 4).map((domain) => (
                    <div key={domain.slug} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-200">{domain.title}</span>
                        <span className={`font-semibold ${scoreTone(domain.score)}`}>
                          {domain.score}%
                        </span>
                      </div>
                      <Progress value={domain.score} className="h-2" />
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <BrainCircuit className="h-4 w-4 text-fuchsia-300" />
                    Personalized insight
                  </div>
                  <p className="mt-2 text-sm text-slate-200 leading-6">
                    {topMatch.stageInsight}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-background/70">
          <CardHeader>
            <CardTitle>Skill Inputs</CardTitle>
            <CardDescription>
              Resume detection plus manual skills you want to experiment with
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-sm text-muted-foreground">Selected Industry</p>
              <p className="font-semibold mt-1">{user.industry || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Experience</p>
              <p className="font-semibold mt-1">
                {user.experience} year{user.experience === 1 ? "" : "s"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Detected from profile/resume</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {detectedSkills.length ? (
                  detectedSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No skills detected yet. Build/save a resume or choose skills manually below.
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <WandSparkles className="h-4 w-4 text-cyan-400" />
                <p className="text-sm font-medium">Manual skill experiment</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Add extra skills to simulate how your role readiness changes.
              </p>
              <div className="mt-3">
                <Input
                  value={skillQuery}
                  onChange={(event) => setSkillQuery(event.target.value)}
                  placeholder="Search skills like React, SQL, Kubernetes..."
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {extraSkills.map((skill) => (
                  <Button
                    key={skill}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeSkill(skill)}
                    className="h-8"
                  >
                    {skill} ×
                  </Button>
                ))}
              </div>
              <div className="mt-4 max-h-44 overflow-y-auto rounded-xl border bg-muted/20 p-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-3">
                  <Filter className="h-3.5 w-3.5" />
                  Suggested skills
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.slice(0, 36).map((skill) => (
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
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Domain Readiness Graph</CardTitle>
            <CardDescription>
              Weighted by core requirements first, then advanced depth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    cursor={{ fill: "rgba(148, 163, 184, 0.06)" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const item = payload[0].payload;
                      return (
                        <div className="rounded-xl border bg-background px-3 py-2 shadow-lg">
                          <p className="font-medium">{item.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            Overall: {item.score}%
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Core: {item.coreScore}% | Advanced: {item.advancedScore}%
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="score" radius={[10, 10, 4, 4]}>
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alternative Career Matches</CardTitle>
            <CardDescription>
              Other roles that can become strong fits with targeted upskilling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {supportRoles.map((role) => (
              <div
                key={role.slug}
                className="rounded-2xl border bg-card/60 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{role.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {role.summary}
                    </p>
                  </div>
                  <div className={`text-lg font-bold ${scoreTone(role.score)}`}>
                    {role.score}%
                  </div>
                </div>
                <Progress value={role.score} className="h-2" />
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span>Core: {role.coreScore}%</span>
                  <span>Advanced: {role.advancedScore}%</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {role.nextSkills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline">
                      Learn {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {domainResults.map((domain) => (
          <Card key={domain.slug}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{domain.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {domain.summary}
                  </CardDescription>
                </div>
                <div className={`text-2xl font-bold ${scoreTone(domain.score)}`}>
                  {domain.score}%
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border bg-muted/20 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Core readiness
                  </p>
                  <p className="mt-2 text-lg font-semibold">{domain.coreScore}%</p>
                  <Progress value={domain.coreScore} className="mt-3 h-2" />
                </div>
                <div className="rounded-xl border bg-muted/20 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Advanced readiness
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {domain.advancedScore}%
                  </p>
                  <Progress value={domain.advancedScore} className="mt-3 h-2" />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Core skills you already have</p>
                <div className="flex flex-wrap gap-2">
                  {domain.matchedCoreSkills.length ? (
                    domain.matchedCoreSkills.map((skill) => (
                      <Badge
                        key={skill}
                        className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/10"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No core skills matched yet.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Missing core skills</p>
                <div className="flex flex-wrap gap-2">
                  {domain.missingCoreSkills.length ? (
                    domain.missingCoreSkills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Core foundation covered well.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Missing advanced skills</p>
                <div className="flex flex-wrap gap-2">
                  {domain.missingAdvancedSkills.length ? (
                    domain.missingAdvancedSkills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Good advanced coverage already.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-muted/40 p-3 text-sm text-muted-foreground flex items-start gap-2">
                <ArrowUpRight className="h-4 w-4 mt-0.5 text-cyan-400" />
                {domain.stageInsight}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
