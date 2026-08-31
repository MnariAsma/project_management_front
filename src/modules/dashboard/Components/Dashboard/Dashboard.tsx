import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useGetProjectsQuery } from "../../../projects/Apis/projectApi";
import { useGetGithubRepositoriesQuery } from "../../../github/Apis/githubApi";
import { PROJECTS } from "../../../../routes/routes";

export default function DashboardComponent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: projectData, isLoading: isLoadingProjects } = useGetProjectsQuery();
  const { data: repoData } = useGetGithubRepositoriesQuery();

  const projects = projectData?.projects || [];
  const totalProjects = projects.length;
  const totalRepos = repoData?.data?.length ?? 0;

  return (
    <div>
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome back, <strong>{user?.name ?? "Developer"}</strong>!
        </p>
      </header>

      <div className="stats-grid">
        <div
          className="stat-card"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(PROJECTS)}
        >
          <div className="stat-icon stat-icon--blue">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </div>
          <div>
            <p className="stat-label">Total Projects</p>
            <p className="stat-value">{totalProjects}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--purple">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
          <div>
            <p className="stat-label">GitHub Repositories</p>
            <p className="stat-value">{totalRepos}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--green">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="stat-label">GitHub Connection</p>
            <p className="stat-value stat-value--green">Active</p>
          </div>
        </div>
      </div>


      <div style={{ marginTop: "36px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-h)" }}>
              Recent Projects
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Quick view of your ongoing projects
            </p>
          </div>
          <button
            onClick={() => navigate(PROJECTS)}
            style={{
              fontSize: "13px",
              color: "var(--accent)",
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(108, 99, 255, 0.1)",
            }}
          >
            View all projects →
          </button>
        </div>

        {isLoadingProjects && (
          <div style={{ color: "var(--text-muted)", padding: "20px 0" }}>
            Loading projects...
          </div>
        )}

        {!isLoadingProjects && projects.length === 0 && (
          <div className="dashboard-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 7h18M3 12h18M3 17h18" />
            </svg>
            <p>No projects yet. Head to the Projects tab to create your first one.</p>
          </div>
        )}

        {!isLoadingProjects && projects.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {projects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-h)" }}>
                    {project.name}
                  </h3>

                  <span
                    style={{
                      fontSize: "11px",
                      padding: "3px 8px",
                      borderRadius: "12px",
                      background: "rgba(34, 197, 94, 0.15)",
                      color: "var(--green)",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >

                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "var(--green)",
                      }}
                    />
                    Completed
                  </span>
                </div>
                {project.description && (
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {project.description}
                  </p>
                )}
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "auto" }}>
                  {project.repositories?.length || 0} repository linked
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
