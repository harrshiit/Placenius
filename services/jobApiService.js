import { jobCategories } from "@/data/job-categories";

export { jobCategories };

const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;
const ERROR_CACHE_TTL_MS = 2 * 60 * 1000;
const RAPIDAPI_HOST = "jsearch.p.rapidapi.com";
const JSEARCH_ENDPOINT = "/search";

const categoryKeywords = {
  "Software Engineer": [
    "software engineer",
    "software developer",
    "sde",
    "programmer",
  ],
  "Frontend Developer": [
    "frontend",
    "front end",
    "react",
    "ui developer",
    "web developer",
  ],
  "Backend Developer": [
    "backend",
    "back end",
    "node",
    "api developer",
    "server",
  ],
  "Full Stack Developer": ["full stack", "fullstack", "mern", "mean"],
  "AI/ML Engineer": [
    "ai",
    "ml",
    "machine learning",
    "artificial intelligence",
    "deep learning",
  ],
  "Data Scientist": [
    "data scientist",
    "data science",
    "data analyst",
    "analytics",
  ],
  "DevOps Engineer": ["devops", "cloud engineer", "site reliability", "sre"],
};

const skillSignals = [
  ["React", ["react", "frontend", "front end", "ui developer"]],
  ["JavaScript", ["javascript", "js", "node", "react"]],
  ["TypeScript", ["typescript", "ts"]],
  ["HTML", ["html"]],
  ["CSS", ["css", "tailwind", "responsive"]],
  ["Node.js", ["node", "node.js", "express"]],
  ["Express.js", ["express", "express.js"]],
  ["REST APIs", ["rest", "api", "apis"]],
  ["Python", ["python", "django", "flask", "fastapi", "machine learning"]],
  ["SQL", ["sql", "postgres", "mysql", "database"]],
  ["MongoDB", ["mongodb", "mongo"]],
  ["Data Structures", ["data structures", "dsa", "algorithms"]],
  ["Algorithms", ["algorithms", "dsa"]],
  ["Machine Learning", ["machine learning", "ml", "model training"]],
  ["Scikit-learn", ["scikit", "sklearn", "scikit-learn"]],
  ["Pandas", ["pandas"]],
  ["NumPy", ["numpy"]],
  ["Docker", ["docker", "container"]],
  ["Kubernetes", ["kubernetes", "k8s"]],
  ["AWS", ["aws", "amazon web services", "cloud"]],
  ["CI/CD", ["ci/cd", "ci cd", "pipeline", "github actions"]],
  ["Linux", ["linux", "shell", "bash"]],
  ["Git", ["git", "github", "version control"]],
];

function normalize(value = "") {
  return value.toLowerCase().trim();
}

function getCacheKey({ query, category, limit }) {
  return JSON.stringify({
    query: normalize(query),
    category,
    limit,
  });
}

function writeCache(cacheKey, jobs, ttlMs = CACHE_TTL_MS, status = null) {
  cache.set(cacheKey, {
    createdAt: Date.now(),
    jobs,
    ttlMs,
    status,
  });
}

function matchesCategory(job, category) {
  if (!category || category === "all") return true;

  const title = normalize(job.title);
  const keywords = categoryKeywords[category] || [];
  return keywords.some((keyword) => title.includes(keyword));
}

function inferSkills(job) {
  const haystack = normalize(`${job.title} ${job.description}`);
  const skills = skillSignals
    .filter(([, signals]) => signals.some((signal) => haystack.includes(signal)))
    .map(([skill]) => skill);

  return Array.from(new Set(skills)).slice(0, 8);
}

function pickApplyLink(job) {
  if (job.job_apply_link) return job.job_apply_link;
  if (job.job_google_link) return job.job_google_link;
  return job.apply_options?.[0]?.apply_link || "#";
}

function mapApiJob(job, index) {
  const location =
    job.job_location ||
    [job.job_city, job.job_state, job.job_country].filter(Boolean).join(", ") ||
    "Remote / Not specified";

  const mappedJob = {
    id: job.job_id || `api-job-${index}`,
    title: job.job_title || "Untitled role",
    company: job.employer_name || "Unknown company",
    applyLink: pickApplyLink(job),
    description: job.job_description || "",
    location,
    type: job.job_employment_type || "Not specified",
    source: "api",
  };

  return {
    ...mappedJob,
    requiredSkills: inferSkills(mappedJob),
  };
}

export async function fetchApiJobs({
  query = "",
  category = "all",
  limit = 10,
} = {}) {
  const defaultResult = {
    jobs: [],
    status: {
      code: "missing_key",
      message: "RapidAPI key is missing.",
    },
  };

  if (!process.env.RAPIDAPI_KEY) {
    return defaultResult;
  }

  const normalizedLimit = Math.min(Math.max(Number(limit) || 10, 1), 10);
  const cacheKey = getCacheKey({ query, category, limit: normalizedLimit });
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.createdAt < (cached.ttlMs || CACHE_TTL_MS)) {
    return {
      jobs: cached.jobs,
      status: cached.status || { code: "ok", message: "Loaded from cache." },
    };
  }

  const searchQuery = [query, category !== "all" ? category : "", "India"]
    .filter(Boolean)
    .join(" ")
    .trim() || "software developer India";

  try {
    const url = new URL(`https://${RAPIDAPI_HOST}${JSEARCH_ENDPOINT}`);
    url.searchParams.set("query", searchQuery);
    url.searchParams.set("page", "1");
    url.searchParams.set("num_pages", "1");
    url.searchParams.set("country", "in");

    const response = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      console.warn("JSearch API unavailable:", response.status, response.statusText);
      const status = {
        code:
          response.status === 403
            ? "forbidden"
            : response.status === 429
              ? "rate_limited"
              : "api_error",
        message:
          response.status === 403
            ? "RapidAPI rejected this key or JSearch subscription."
            : response.status === 429
              ? "RapidAPI rate limit reached."
              : `JSearch API returned ${response.status}.`,
      };
      writeCache(cacheKey, [], ERROR_CACHE_TTL_MS, status);
      return { jobs: [], status };
    }

    const payload = await response.json();
    const jobs = (payload.data || [])
      .map(mapApiJob)
      .filter((job) => matchesCategory(job, category))
      .slice(0, normalizedLimit);

    const status = {
      code: jobs.length ? "ok" : "empty",
      message: jobs.length
        ? "Live jobs loaded."
        : "JSearch returned no jobs with valid apply links for this search.",
    };
    writeCache(cacheKey, jobs, CACHE_TTL_MS, status);

    return { jobs, status };
  } catch (error) {
    console.warn("Failed to fetch JSearch jobs:", error?.message || error);
    const status = {
      code: "network_error",
      message: "Could not reach JSearch API.",
    };
    writeCache(cacheKey, [], ERROR_CACHE_TTL_MS, status);
    return { jobs: [], status };
  }
}
