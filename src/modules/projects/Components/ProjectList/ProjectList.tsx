import { useState } from "react";
import { useGetProjectsQuery } from "../../Apis/projectApi";
import CreateProjectModal from "../CreateProject/CreateProjectModal";

export default function ProjectListComponent() {
  const { data, isLoading, error } = useGetProjectsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const projects = data?.projects || [];

  return (
    <div>
      <header className="dashboard-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1>Projects</h1>
            <p className="dashboard-subtitle">
              Manage your company projects and monitor indexing status
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--accent)",
              color: "#fff",
              padding: "11px 20px",
              borderRadius: "var(--radius-sm)",
              fontWeight: 600,
              fontSize: "14px",
              boxShadow: "0 0 16px var(--accent-glow)",
              transition: "transform 0.15s",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ width: "16px", height: "16px" }}
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Project
          </button>
        </div>
      </header>

      {isLoading && (
        <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)" }}>
          Loading projects...
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
          Failed to load projects.
        </div>
      )}
      {!isLoading && !error && projects.length === 0 && (
        <div className="dashboard-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 7h18M3 12h18M3 17h18" />
          </svg>
          <p>No projects found. Click "New Project" to link repositories and create one.</p>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "20px",
        }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "var(--text-h)",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {project.name}
                </h3>
                {project.slug && (
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {project.slug}
                  </span>
                )}
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  background: "rgba(34, 197, 94, 0.15)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  color: "var(--green)",
                  fontSize: "12px",
                  fontWeight: 600,
                  flexShrink: 0,
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
                Indexation: Completed
              </div>
            </div>
            {project.description && (
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text)",
                  lineHeight: 1.6,
                }}
              >
                {project.description}
              </p>
            )}
            <div
              style={{
                marginTop: "auto",
                paddingTop: "14px",
                borderTop: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Linked Repositories
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--accent)",
                    fontWeight: 600,
                  }}
                >
                  {project.repositories?.length || 0}
                </span>
              </div>

              {project.repositories && project.repositories.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                  }}
                >
                  {project.repositories.map((repo) => (
                    <a
                      key={repo.id}
                      href={repo.github_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "12px",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        color: "var(--text-h)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{ width: "12px", height: "12px" }}
                      >
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                      {repo.name}
                    </a>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  No repositories attached
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
