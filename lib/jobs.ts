export interface Job {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string;
  category: string;
  tags: string[];
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
  company_logo_url: string;
}

export interface RemotiveResponse {
  "job-count": number;
  "total-job-count": number;
  jobs: Job[];
}

export async function getRemoteJobs(search?: string, category?: string): Promise<RemotiveResponse> {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category) params.append("category", category);
  
  const url = `https://remotive.com/api/remote-jobs?${params.toString()}`;
  
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch jobs: ${res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    console.error("Error fetching jobs from Remotive:", error);
    return { "job-count": 0, "total-job-count": 0, jobs: [] };
  }
}

export interface JSearchJob {
  job_id: string;
  employer_name: string;
  employer_logo?: string;
  employer_website?: string;
  job_title: string;
  job_description: string;
  job_apply_link: string;
  job_posted_at_datetime_utc: string;
  job_employment_type: string;
  job_location: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_is_remote: boolean;
  job_min_salary?: number;
  job_max_salary?: number;
  job_salary_currency?: string;
  job_salary_period?: string;
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
  job_benefits?: string[];
}

export interface JSearchResponse {
  status: string;
  data: JSearchJob[];
  message?: string;
}

export async function getAggregatedJobs(
  query: string, 
  options: {
    location?: string;
    page?: number;
    num_pages?: number;
    date_posted?: string;
    remote_only?: boolean;
    employment_types?: string;
    country?: string;
    language?: string;
    job_requirements?: string;
  } = {}
): Promise<JSearchResponse> {
  const apiKey = process.env.JSEARCH_API_KEY || "";
  
  const params = new URLSearchParams();
  params.append("query", options.location ? `${query} in ${options.location}` : query);
  if (options.page) params.append("page", options.page.toString());
  if (options.num_pages) params.append("num_pages", options.num_pages.toString());
  if (options.date_posted) params.append("date_posted", options.date_posted);
  if (options.remote_only) params.append("remote_jobs_only", "true");
  if (options.employment_types) params.append("employment_types", options.employment_types);
  if (options.country) params.append("country", options.country);
  if (options.language) params.append("language", options.language);
  if (options.job_requirements) params.append("job_requirements", options.job_requirements);
  
  const url = `https://jsearch.p.rapidapi.com/search?${params.toString()}`;
  
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com'
      },
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { 
        status: "error", 
        message: errorData.message || res.statusText || "Unknown API error",
        data: [] 
      };
    }
    
    return res.json();
  } catch (error: any) {
    console.error("Error fetching aggregated jobs:", error);
    return { status: "error", message: error.message || "Failed to connect to search service", data: [] };
  }
}


