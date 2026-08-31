import React, { useState } from "react";
import { useGetGithubRepositoriesQuery } from "../../../github/Apis/githubApi";
import { useCreateProjectMutation } from "../../Apis/projectApi";
import { useAppDispatch } from "../../../../hooks/reduxHooks";
import { addToast } from "../../../../slices/toast/toastSlice";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function CreateProjectModal({
  isOpen,
  onClose,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRepoIds, setSelectedRepoIds] = useState<number[]>([]);
  const { data: repoData, isLoading: isLoadingRepos } =useGetGithubRepositoriesQuery();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const dispatch = useAppDispatch();

  if (!isOpen) return null;
  const repositories = repoData?.data || [];
  const handleToggleRepo = (repoId: number) => {
    setSelectedRepoIds((prev) =>
      prev.includes(repoId)
        ? prev.filter((id) => id !== repoId)
        : [...prev, repoId]
    );
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      dispatch(
        addToast({
          message: "Please provide a project name.",
          type: "warning",
        })
      );
      return;
    }
    try {
      const response = await createProject({
        name: name.trim(),
        description: description.trim() || undefined,
        repositories: selectedRepoIds.map((id) => ({ github_repo_id: id })),
      }).unwrap();
      dispatch(
        addToast({
          message: response.message || "Project created successfully!",
          type: "success",
        })
      );
      setName("");
      setDescription("");
      setSelectedRepoIds([]);
      onClose();
    } catch (err: any) {
      dispatch(
        addToast({
          message:
            err?.data?.message ||
            err?.error ||
            "Failed to create project. Please try again.",
          type: "error",
        })
      );
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          width: "100%",
          maxWidth: "540px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "32px",
          boxShadow: "var(--shadow-lg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-h)" }}>
            Create New Project
          </h2>
          <button
            onClick={onClose}
            style={{
              color: "var(--text-muted)",
              fontSize: "18px",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-h)",
                marginBottom: "6px",
              }}
            >
              Project Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Core Banking Platform"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-h)",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-h)",
                marginBottom: "6px",
              }}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project..."
              rows={3}
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-h)",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-h)",
                marginBottom: "6px",
              }}
            >
              Link GitHub Repositories
            </label>
            {isLoadingRepos ? (
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Loading your GitHub repositories...
              </p>
            ) : repositories.length === 0 ? (
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                No repositories found.
              </p>
            ) : (
              <div
                style={{
                  maxHeight: "180px",
                  overflowY: "auto",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-surface)",
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                {repositories.map((repo) => {
                  const isChecked = selectedRepoIds.includes(repo.github_repo_id);
                  return (
                    <label
                      key={repo.github_repo_id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 10px",
                        borderRadius: "6px",
                        background: isChecked
                          ? "rgba(108, 99, 255, 0.15)"
                          : "transparent",
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleRepo(repo.github_repo_id)}
                        style={{ accentColor: "var(--accent)" }}
                      />
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: isChecked ? "var(--accent)" : "var(--text)",
                        }}
                      >
                        {repo.owner}/{repo.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "8px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 18px",
                borderRadius: "var(--radius-sm)",
                fontSize: "14px",
                color: "var(--text)",
                background: "var(--bg-hover)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              style={{
                padding: "10px 20px",
                borderRadius: "var(--radius-sm)",
                fontSize: "14px",
                fontWeight: 600,
                color: "#fff",
                background: "var(--accent)",
                boxShadow: "0 0 16px var(--accent-glow)",
                opacity: isCreating ? 0.7 : 1,
              }}
            >
              {isCreating ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
