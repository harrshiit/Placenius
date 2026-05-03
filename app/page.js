import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Radar,
  Sparkles,
  BrainCircuit,
  TrendingUp,
} from "lucide-react";
import HeroSection from "@/components/hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";
import CareerReadinessWidget from "@/components/career-readiness-widget";

export default function LandingPage() {
  return (
    <>
      <div className="grid-background"></div>

      {/* Hero Section */}
      <HeroSection />

      <section className="w-full pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="max-w-6xl mx-auto border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] items-center">
                <div className="space-y-4">
                  <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-sm text-cyan-200">
                    New flagship feature
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Career Fit Analyzer
                  </h2>
                  <p className="text-muted-foreground leading-7">
                    Placenius now studies your onboarding profile and resume
                    content to estimate how ready you are for Frontend,
                    Full Stack, Backend, Database, AI/ML, and Data Science
                    roles.
                  </p>
                  <div className="space-y-3">
                    {[
                      "Role-wise readiness percentages with visual charts",
                      "Detected strengths from your current skills and resume",
                      "Missing skills and next learning priorities for each domain",
                    ].map((line) => (
                      <div key={line} className="flex items-start gap-3">
                        <Sparkles className="h-4 w-4 mt-1 text-cyan-300" />
                        <span className="text-sm md:text-base">{line}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/career-fit">
                    <Button size="lg" className="mt-3 rounded-full px-7">
                      Open Career Fit Analyzer <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Card className="border-white/10 bg-background/80">
                    <CardContent className="pt-6">
                      <Radar className="h-8 w-8 text-cyan-300 mb-4" />
                      <h3 className="font-semibold">Role Matching</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Compare your current skill set against multiple developer tracks.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-white/10 bg-background/80">
                    <CardContent className="pt-6">
                      <BrainCircuit className="h-8 w-8 text-fuchsia-300 mb-4" />
                      <h3 className="font-semibold">Smart Detection</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Extract skills from resume content and onboarding inputs.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-white/10 bg-background/80">
                    <CardContent className="pt-6">
                      <TrendingUp className="h-8 w-8 text-emerald-300 mb-4" />
                      <h3 className="font-semibold">Learning Path</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        See the exact next skills needed to become placement-ready.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <CareerReadinessWidget />

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-6xl overflow-hidden rounded-lg border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-indigo-500/10 p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                  Feature introduction
                </div>
                <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
                  One placement suite for every step of your career prep
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
                  Placenius brings career guidance, fit analysis, interview
                  practice, job matching, and Indian market insights into one
                  focused student workflow.
                </p>
              </div>
              <Link href="/job-recommendations">
                <Button className="w-full rounded-full md:w-auto">
                  Explore Job Matches <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Why choose Placenius?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary transition-colors duration-300"
              >
                <CardContent className="pt-6 text-center flex flex-col items-center">
                  <div className="flex flex-col items-center justify-center">
                    {feature.icon}
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">50+</h3>
              <p className="text-muted-foreground">Industries Covered</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">1000+</h3>
              <p className="text-muted-foreground">Interview Questions</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">95%</h3>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">24/7</h3>
              <p className="text-muted-foreground">AI Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Four simple steps to accelerate your career growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-xl">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonial.map((testimonial, index) => (
              <Card key={index} className="bg-background">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          width={40}
                          height={40}
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="rounded-full object-cover border-2 border-primary/20"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                        <p className="text-sm text-primary">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <blockquote>
                      <p className="text-muted-foreground italic relative">
                        <span className="text-3xl text-primary absolute -top-4 -left-2">
                          &quot;
                        </span>
                        {testimonial.quote}
                        <span className="text-3xl text-primary absolute -bottom-4">
                          &quot;
                        </span>
                      </p>
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full">
        <div className="mx-auto py-24 gradient rounded-lg">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
              Accelerate Your Career with  Placenius
            </h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
              Joined thousands of Students who are advancing their careers
              with AI-powered guidance.
            </p>
            <Link href="/dashboard" passHref>
              <Button
                size="lg"
                variant="secondary"
                className="h-11 mt-5 animate-bounce"
              >
                Start Your Journey Today <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
