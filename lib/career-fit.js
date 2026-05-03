import { allCareerSkills, careerDomains, skillAliases } from "@/data/career-domains";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeToken(value) {
  return value.trim().toLowerCase();
}

export function extractDetectedSkills({
  profileSkills = [],
  resumeContent = "",
  extraSkills = [],
}) {
  const text = `${profileSkills.join(" ")} ${resumeContent} ${extraSkills.join(" ")}`
    .toLowerCase();
  const found = new Set();

  for (const [canonicalSkill, aliases] of Object.entries(skillAliases)) {
    const matched = aliases.some((alias) => {
      const pattern = new RegExp(
        `(^|[^a-z0-9+.#-/])${escapeRegExp(alias.toLowerCase())}([^a-z0-9+.#-/]|$)`
      );
      return pattern.test(text);
    });

    if (matched) {
      found.add(canonicalSkill);
    }
  }

  [...profileSkills, ...extraSkills]
    .map(normalizeToken)
    .filter(Boolean)
    .forEach((skill) => {
      const canonical = Object.entries(skillAliases).find(([, aliases]) =>
        aliases.map((item) => item.toLowerCase()).includes(skill)
      )?.[0];

      if (canonical) {
        found.add(canonical);
      }
    });

  return Array.from(found).sort((a, b) => a.localeCompare(b));
}

function getReadinessLabel(score) {
  if (score >= 75) return "Strong match";
  if (score >= 55) return "Placement-ready direction";
  if (score >= 30) return "Needs focused skill building";
  return "Early stage";
}

function getStageInsight(coreScore, advancedScore) {
  if (coreScore >= 80 && advancedScore >= 50) {
    return "You already cover most entry-level requirements and have visible growth depth.";
  }
  if (coreScore >= 60) {
    return "Your foundation is forming well. Strengthen advanced tools to become interview-ready.";
  }
  return "Start by building stronger core fundamentals before optimizing advanced topics.";
}

function analyzeDomain(domain, matchedSkills) {
  const coreMatched = domain.core.filter((skill) => matchedSkills.has(skill));
  const advancedMatched = domain.advanced.filter((skill) =>
    matchedSkills.has(skill)
  );

  const coreScore = Math.round((coreMatched.length / domain.core.length) * 100);
  const advancedScore = Math.round(
    (advancedMatched.length / domain.advanced.length) * 100
  );

  const score = Math.round(coreScore * 0.7 + advancedScore * 0.3);

  return {
    ...domain,
    score,
    coreScore,
    advancedScore,
    readinessLabel: getReadinessLabel(score),
    stageInsight: getStageInsight(coreScore, advancedScore),
    matchedSkills: [...coreMatched, ...advancedMatched],
    matchedCoreSkills: coreMatched,
    matchedAdvancedSkills: advancedMatched,
    missingCoreSkills: domain.core.filter((skill) => !matchedSkills.has(skill)),
    missingAdvancedSkills: domain.advanced.filter(
      (skill) => !matchedSkills.has(skill)
    ),
    nextSkills: [
      ...domain.core.filter((skill) => !matchedSkills.has(skill)),
      ...domain.advanced.filter((skill) => !matchedSkills.has(skill)),
    ].slice(0, 5),
  };
}

export function analyzeCareerFit({
  profileSkills = [],
  resumeContent = "",
  extraSkills = [],
}) {
  const detectedSkills = extractDetectedSkills({
    profileSkills,
    resumeContent,
    extraSkills,
  });
  const matchedSkills = new Set(detectedSkills);

  const domainResults = careerDomains
    .map((domain) => analyzeDomain(domain, matchedSkills))
    .sort((a, b) => b.score - a.score);

  const topMatch = domainResults[0];
  const supportRoles = domainResults.slice(1, 4);
  const overallMomentum = Math.round(
    domainResults.reduce((sum, domain) => sum + domain.score, 0) /
      domainResults.length
  );

  return {
    detectedSkills,
    allCareerSkills,
    topMatch,
    supportRoles,
    domainResults,
    chartData: domainResults.map((domain) => ({
      name: domain.shortTitle,
      fullName: domain.title,
      score: domain.score,
      coreScore: domain.coreScore,
      advancedScore: domain.advancedScore,
      color: domain.color,
    })),
    overallMomentum,
    hasResumeContent: Boolean(resumeContent?.trim()),
    profileSkillCount: profileSkills.length,
    extraSkillCount: extraSkills.length,
    generatedAt: new Date().toISOString(),
  };
}
