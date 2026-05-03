import { NextResponse } from "next/server";
import { getCurrentUserAdminState } from "@/lib/admin";
import { deleteAdminJob, updateAdminJob } from "@/services/adminJobService";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Access denied" }, { status: 403 });
}

export async function PUT(request, { params }) {
  const { user, isAdmin } = await getCurrentUserAdminState();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const job = await updateAdminJob(params.id, body);
    return NextResponse.json({ job });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Failed to update job",
        details: error.details ?? null,
      },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  const { user, isAdmin } = await getCurrentUserAdminState();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin) {
    return unauthorizedResponse();
  }

  try {
    await deleteAdminJob(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete job" },
      { status: error.status || 500 }
    );
  }
}
