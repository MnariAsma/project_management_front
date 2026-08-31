import { useGetGithubRepositoriesQuery } from "../../Apis/githubApi";

export default function RepositoryListComponent() {
  const { data, isLoading, error } = useGetGithubRepositoriesQuery();
  const repositories = data?.data || [];

  return (
    <div style={{ marginTop: "32px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-h)" }}>
          Connected GitHub Repositories
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
          Repositories synchronized from your GitHub account
        </p>
      </div>

      {isLoading && (
        <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)" }}>
          Loading GitHub repositories...
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "16px",
            borderRadius: "var(--radius-sm)",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            fontSize: "14px",
          }}
        >
          Failed to load repositories from GitHub.
        </div>
      )}

      {!isLoading && !error && repositories.length === 0 && (
        <div className="dashboard-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
          </svg>
          <p>No GitHub repositories found.</p>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {repositories.map((repo) => (
          <a
            key={repo.github_repo_id}
            href={repo.github_url}
            target="_blank"
            rel="noreferrer"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  background: "rgba(168, 85, 247, 0.15)",
                  color: "var(--purple)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "16px", height: "16px" }}>
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-h)" }}>
                {repo.name}
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Owner: {repo.owner}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
