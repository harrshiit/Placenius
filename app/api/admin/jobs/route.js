import { NextResponse } from "next/server";
import { getCurrentUserAdminState } from "@/lib/admin";
import { createAdminJob, listAdminJobs } from "@/services/adminJobService";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Access denied" }, { status: 403 });
}

export async function GET() {
  const { user, isAdmin } = await getCurrentUserAdminState();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin) {
    return unauthorizedResponse();
  }

  const jobs = await listAdminJobs();
  return NextResponse.json({ jobs });
}

export async function POST(request) {
  const { user, isAdmin } = await getCurrentUserAdminState();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const job = await createAdminJob(body);
    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Failed to create job",
        details: error.details ?? null,
      },
      { status: error.status || 500 }
    );
  }
}
