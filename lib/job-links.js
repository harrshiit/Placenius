const blockedApplyHosts = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "example.com",
]);

export function getSafeApplyLink(applyLink) {
  try {
    const url = new URL(applyLink);
    const hostname = url.hostname.replace(/^www\./, "");

    if (!["http:", "https:"].includes(url.protocol)) return null;
    if (blockedApplyHosts.has(hostname)) return null;

    return url.toString();
  } catch {
    return null;
  }
}

export function hasSafeApplyLink(job = {}) {
  return Boolean(getSafeApplyLink(job.applyLink));
}
