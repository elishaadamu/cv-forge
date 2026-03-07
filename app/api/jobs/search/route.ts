import { NextRequest, NextResponse } from "next/server";
import { getAggregatedJobs } from "@/lib/jobs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const location = searchParams.get("location") || undefined;
  const date_posted = searchParams.get("date_posted") || undefined;
  const remote_only = searchParams.get("remote_only") === "true";
  const employment_types = searchParams.get("employment_types") || undefined;
  const country = searchParams.get("country") || undefined;
  const job_requirements = searchParams.get("job_requirements") || undefined;
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined;

  if (!query) {
    return NextResponse.json({ status: "error", message: "Query is required" }, { status: 400 });
  }

  try {
    const data = await getAggregatedJobs(query, {
      location,
      page,
      date_posted,
      remote_only,
      employment_types,
      country,
      job_requirements
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
  }
}
