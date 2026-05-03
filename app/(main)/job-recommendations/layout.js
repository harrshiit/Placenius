import { Suspense } from "react";
import { BarLoader } from "react-spinners";

export default function Layout({ children }) {
  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-title">
            Skill-Based Job Matches
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Recommended jobs ranked by how closely your current skill set matches
            job requirements.
          </p>
        </div>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
    </div>
  );
}
