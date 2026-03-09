import { NextRequest, NextResponse } from "next/server";
import { getAggregatedJobDetails } from "@/lib/jobs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("job_id");

  if (!jobId) {
    return NextResponse.json({ status: "error", message: "Job ID is required" }, { status: 400 });
  }

  try {
    const data = await getAggregatedJobDetails(jobId);

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
  }
}
