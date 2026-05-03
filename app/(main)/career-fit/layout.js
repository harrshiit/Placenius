import { Suspense } from "react";
import { BarLoader } from "react-spinners";

export default function Layout({ children }) {
  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-title">
            Career Fit Analyzer
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            See which tech roles match your current skill set, what you are
            missing, and where to focus next.
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
