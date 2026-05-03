import { skillAliases } from "@/data/career-domains";

function normalize(value) {
  return value.trim().toLowerCase();
}

function canonicalize(skill) {
  const normalized = normalize(skill);

  for (const [canonical, aliases] of Object.entries(skillAliases)) {
    const aliasMatch = aliases.some((alias) => normalize(alias) === normalized);
    if (aliasMatch || normalize(canonical) === normalized) {
      return canonical;
    }
  }

  return skill.trim();
}

function categorizeMatch(matchPercentage) {
  if (matchPercentage > 70) return "high";
  if (matchPercentage >= 50) return "medium";
  return "low";
}

export function matchJobToSkills(userSkills = [], job = {}) {
  const normalizedUserSkills = new Set(userSkills.map(canonicalize));
  const requiredSkills = (job.requiredSkills || []).map(canonicalize);

  const matchedSkills = requiredSkills.filter((skill) =>
    normalizedUserSkills.has(skill)
  );
  const missingSkills = requiredSkills.filter(
    (skill) => !normalizedUserSkills.has(skill)
  );

  const matchPercentage = requiredSkills.length
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : 0;

  return {
    ...job,
    requiredSkills,
    matchedSkills,
    missingSkills,
    matchPercentage,
    category: categorizeMatch(matchPercentage),
  };
}

export function sortJobsByMatch(jobs = []) {
  return [...jobs].sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    return a.title.localeCompare(b.title);
  });
}

export function groupJobsByCategory(jobs = []) {
  return jobs.reduce(
    (accumulator, job) => {
      accumulator[job.category].push(job);
      return accumulator;
    },
    { high: [], medium: [], low: [] }
  );
}
