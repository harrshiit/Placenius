"use client";

import React, { useMemo, useState } from "react";
import {
  Award,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  FileText,
  Gauge,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const readinessInputs = [
  {
    id: "resume",
    label: "Resume strength",
    icon: FileText,
    weight: 0.22,
    min: "Needs work",
    max: "ATS ready",
  },
  {
    id: "skills",
    label: "Core skills",
    icon: Code2,
    weight: 0.28,
    min: "Beginner",
    max: "Project ready",
  },
  {
    id: "projects",
    label: "Project proof",
    icon: BriefcaseBusiness,
    weight: 0.2,
    min: "Few examples",
    max: "Strong portfolio",
  },
  {
    id: "interview",
    label: "Interview prep",
    icon: GraduationCap,
    weight: 0.18,
    min: "Not started",
    max: "Confident",
  },
  {
    id: "applications",
    label: "Application habit",
    icon: BookOpenCheck,
    weight: 0.12,
    min: "Irregular",
    max: "Consistent",
  },
];

const startingScores = {
  resume: 62,
  skills: 58,
  projects: 46,
  interview: 52,
  applications: 40,
};

function getReadinessLabel(score) {
  if (score >= 82) return "Placement ready";
  if (score >= 66) return "Nearly ready";
  if (score >= 48) return "Building momentum";
  return "Needs focused prep";
}

function getRecommendation(scores) {
  const weakest = readinessInputs.reduce((lowest, item) =>
    scores[item.id] < scores[lowest.id] ? item : lowest
  );

  const advice = {
    resume: "Improve your resume bullets with measurable outcomes and role keywords.",
    skills: "Pick one target role and close the top missing core skills first.",
    projects: "Add one polished project with a clear problem, stack, and result.",
    interview: "Practice short daily interview drills and review every explanation.",
    applications: "Set a weekly application target and track follow-ups.",
  };

  return advice[weakest.id];
}

export default function CareerReadinessWidget() {
  const [scores, setScores] = useState(startingScores);

  const readinessScore = useMemo(
    () =>
      Math.round(
        readinessInputs.reduce(
          (total, item) => total + scores[item.id] * item.weight,
          0
        )
      ),
    [scores]
  );

  const completedItems = readinessInputs.filter(
    (item) => scores[item.id] >= 70
  ).length;

  const handleChange = (id, value) => {
    setScores((current) => ({
      ...current,
      [id]: Number(value),
    }));
  };

  const boostPlan = () => {
    setScores({
      resume: 92,
      skills: 88,
      projects: 84,
      interview: 89,
      applications: 82,
    });
  };

  return (
    <section className="w-full py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid max-w-6xl mx-auto gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-5">
            <Badge className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-emerald-200 hover:bg-emerald-400/10">
              <Gauge className="mr-2 h-4 w-4" />
              Interactive readiness check
            </Badge>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Estimate your placement readiness in seconds
              </h2>
              <p className="text-muted-foreground leading-7">
                Adjust each career signal and Placenius gives students a quick
                readiness score, a status label, and one focused next step.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                <div>
                  <h3 className="font-semibold">Personalized signal</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Shows how resume, skills, projects, interviews, and habits
                    combine into one useful score.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                <Sparkles className="mt-0.5 h-5 w-5 text-cyan-300" />
                <div>
                  <h3 className="font-semibold">Clear next move</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Highlights the weakest area so students know where to focus
                    before applying.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="p-5 md:p-7">
              <div className="grid gap-6 md:grid-cols-[0.75fr_1.25fr]">
                <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-background/70 p-6 text-center">
                  <div
                    className="grid h-36 w-36 place-items-center rounded-full border-8 border-cyan-300/20"
                    style={{
                      background: `conic-gradient(rgb(34 211 238) ${readinessScore}%, rgba(255,255,255,0.08) 0)`,
                    }}
                  >
                    <div className="grid h-28 w-28 place-items-center rounded-full bg-background">
                      <div>
                        <p className="text-4xl font-bold">
                          {readinessScore}
                        </p>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Score
                        </p>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">
                    {getReadinessLabel(readinessScore)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {completedItems} of {readinessInputs.length} signals are
                    above the target mark.
                  </p>
                  <Button className="mt-5 w-full" onClick={boostPlan}>
                    <Award className="mr-2 h-4 w-4" />
                    Preview strong profile
                  </Button>
                </div>

                <div className="space-y-5">
                  {readinessInputs.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400/10 text-cyan-200">
                              <Icon className="h-4 w-4" />
                            </span>
                            <label
                              className="text-sm font-medium"
                              htmlFor={item.id}
                            >
                              {item.label}
                            </label>
                          </div>
                          <span className="text-sm font-semibold">
                            {scores[item.id]}%
                          </span>
                        </div>
                        <input
                          id={item.id}
                          type="range"
                          min="0"
                          max="100"
                          value={scores[item.id]}
                          onChange={(event) =>
                            handleChange(item.id, event.target.value)
                          }
                          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-300"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{item.min}</span>
                          <span>{item.max}</span>
                        </div>
                      </div>
                    );
                  })}

                  <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-sm font-semibold text-emerald-200">
                      Recommended next step
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {getRecommendation(scores)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
