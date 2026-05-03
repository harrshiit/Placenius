import { UserPlus, FileEdit, Users, Radar } from "lucide-react";

export const howItWorks = [
  {
    title: "Professional Onboarding",
    description: "Share your industry and expertise for personalized guidance",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    title: "Build or Upload Skills",
    description:
      "Create your resume and profile so Placenius can understand your current stack",
    icon: <FileEdit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Analyze Career Fit",
    description:
      "See how strongly your skills match Frontend, Backend, Full Stack, AI, and Data roles",
    icon: <Radar className="w-8 h-8 text-primary" />,
  },
  {
    title: "Prepare for Interviews",
    description:
      "Practice with AI-powered mock interviews tailored to your role",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
];
