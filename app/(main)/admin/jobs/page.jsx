import { redirect } from "next/navigation";
import AdminJobsPanel from "./_components/admin-jobs-panel";
import { getCurrentUserAdminState } from "@/lib/admin";
import { listAdminJobs } from "@/services/adminJobService";
import { allCareerSkills } from "@/data/career-domains";
import {
  adminRoleOptions,
  jobTypeOptions,
  locationOptions,
} from "@/data/job-admin-config";

export default async function AdminJobsPage() {
  const { user, email, isAdmin } = await getCurrentUserAdminState();

  if (!user) {
    redirect("/sign-in");
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-rose-300">
            Access Denied
          </p>
          <h1 className="mt-4 text-3xl font-bold text-white">
            You do not have permission to manage curated jobs.
          </h1>
          <p className="mt-3 text-muted-foreground">
            Signed in as {email || "an unknown user"}, but this page is reserved
            for the Placenius admin account.
          </p>
        </div>
      </div>
    );
  }

  const jobs = await listAdminJobs();

  return (
    <div className="container mx-auto py-6">
      <AdminJobsPanel
        initialJobs={jobs}
        skillOptions={allCareerSkills}
        roleOptions={adminRoleOptions}
        jobTypeOptions={jobTypeOptions}
        locationOptions={locationOptions}
      />
    </div>
  );
}
