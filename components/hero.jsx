"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  LineChart,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const productTools = [
  {
    title: "AI Resume Builder",
    description: "Create ATS-friendly resumes and improve resume bullets with AI.",
    icon: FileText,
    tone: "text-cyan-300 bg-cyan-400/10",
  },
  {
    title: "Career Fit Analyzer",
    description:
      "Measure role-wise readiness and discover missing core and advanced skills.",
    icon: BrainCircuit,
    tone: "text-emerald-300 bg-emerald-400/10",
  },
  {
    title: "Interview Prep",
    description:
      "Practice AI-generated role-based quizzes with explanations and score tracking.",
    icon: GraduationCap,
    tone: "text-amber-300 bg-amber-400/10",
  },
  {
    title: "Industry Insights",
    description:
      "Track salary ranges, trends, demand level, and weekly background updates.",
    icon: LineChart,
    tone: "text-fuchsia-300 bg-fuchsia-400/10",
  },
];

const HeroSection = () => {
  const boardRef = useRef(null);

  useEffect(() => {
    const element = boardRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 110;

      if (scrollPosition > scrollThreshold) {
        element.classList.add("scrolled");
      } else {
        element.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full pt-32 md:pt-40 pb-14 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
      </div>

      <div className="container mx-auto px-4">
        <div className="space-y-10 text-center">
          <div className="space-y-6 mx-auto">
            <Badge className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-cyan-200 hover:bg-cyan-400/10">
              <Sparkles className="mr-2 h-4 w-4" />
              Placenius growth suite
            </Badge>
            <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title animate-gradient">
              Your AI Career Coach for
              <br />
              Placement Success
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
              Advance your career with personalized guidance, interview prep,
              and AI-powered tools for job success.
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
            <Link href="https://www.youtube.com/">
              <Button size="lg" variant="outline" className="px-8">
                Watch Demo
              </Button>
            </Link>
          </div>

          <div className="hero-image-wrapper">
            <div ref={boardRef} className="hero-board">
              <div className="hero-board-frame">
                <div className="hero-board-topline">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-slate-500">
                      Placenius Product Experience
                    </p>
                    <h3 className="text-2xl font-semibold text-white mt-3">
                      One platform for smarter placement prep
                    </h3>
                  </div>
                  <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
                    Brand: Placenius
                  </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {productTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <div
                        key={tool.title}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left"
                      >
                        <div
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${tool.tone}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="mt-4">
                          <h4 className="text-base font-semibold text-white">
                            {tool.title}
                          </h4>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                    <div className="flex items-center gap-2 text-cyan-200 font-medium">
                      <WandSparkles className="h-4 w-4" />
                      Growth Tools
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Resume builder, cover letter generator, interview prep, and
                      career fit analysis in one clean workflow.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                    <div className="flex items-center gap-2 text-emerald-200 font-medium">
                      <BriefcaseBusiness className="h-4 w-4" />
                      Placement Focus
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Built specifically to help students identify their strongest
                      career path and prepare for real job applications.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                    <div className="flex items-center gap-2 text-fuchsia-200 font-medium">
                      <LineChart className="h-4 w-4" />
                      Live Insights
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Industry demand, salary trends, and background updates make
                      the dashboard feel like a real product, not a static demo.
                    </p>
                  </div>
                </div>

                <div className="hero-board-footer">
                  <p className="text-sm text-slate-300">
                    Placenius combines AI resume building, career fit analysis,
                    cover letter generation, interview preparation, and industry
                    intelligence into one placement-focused product experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
