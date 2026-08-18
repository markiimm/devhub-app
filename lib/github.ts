export interface GithubRepoInfo {
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  updatedAt: string;
  url: string;
}

function parseGithubRepo(input: string): { owner: string; repo: string } | null {
  const cleaned = input
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/^github\.com\//, "")
    .replace(/\/$/, "");
  const [owner, repo] = cleaned.split("/").filter(Boolean);
  if (!owner || !repo) return null;
  return { owner, repo: repo.replace(/\.git$/, "") };
}

/**
 * Busca dados públicos de um repositório no GitHub (sem token — sujeito ao rate limit
 * de 60 req/hora por IP da API pública). Retorna null em qualquer falha, de propósito:
 * o card de GitHub é sempre um "bônus" opcional, nunca deve derrubar a página.
 */
export async function fetchGithubRepo(input: string): Promise<GithubRepoInfo | null> {
  const parsed = parseGithubRepo(input);
  if (!parsed) return null;

  try {
    const res = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      fullName: data.full_name,
      description: data.description,
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
      openIssues: data.open_issues_count ?? 0,
      language: data.language ?? null,
      updatedAt: data.pushed_at,
      url: data.html_url,
    };
  } catch {
    return null;
  }
}

/**
 * Busca os pushes públicos recentes de um usuário no GitHub (API de eventos —
 * cobre só os últimos ~90 dias e é paginada em lotes de 30). Retorna uma lista
 * de timestamps (um por commit) pra alimentar o heatmap de atividade.
 * Sem token, sujeito ao mesmo rate limit de 60 req/hora — por isso buscamos no
 * máximo 3 páginas. Falha em silêncio: é sempre um complemento, nunca obrigatório.
 */
export async function fetchGithubActivity(username: string): Promise<string[]> {
  const clean = username.trim().replace(/^@/, "");
  if (!clean) return [];

  const timestamps: string[] = [];
  try {
    for (let page = 1; page <= 3; page++) {
      const res = await fetch(`https://api.github.com/users/${clean}/events/public?per_page=100&page=${page}`, {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 1800 },
      });
      if (!res.ok) break;
      const events = await res.json();
      if (!Array.isArray(events) || events.length === 0) break;

      for (const event of events) {
        if (event.type === "PushEvent") {
          const commitCount = Array.isArray(event.payload?.commits) ? event.payload.commits.length : 1;
          for (let i = 0; i < commitCount; i++) timestamps.push(event.created_at);
        }
      }
      if (events.length < 100) break;
    }
  } catch {
    return timestamps;
  }
  return timestamps;
}
