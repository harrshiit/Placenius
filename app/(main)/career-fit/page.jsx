import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";
import { getCareerFitAnalysis } from "@/actions/career-fit";
import CareerFitDashboard from "./_components/career-fit-dashboard";

export default async function CareerFitPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const result = await getCareerFitAnalysis();

  return (
    <div className="container mx-auto py-6">
      <CareerFitDashboard {...result} />
    </div>
  );
}
