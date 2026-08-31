import type { GithubRepository } from "../../github/types/githubTypes";

export interface ProjectRepository extends GithubRepository {
  id: string;
  project_id: string;
}

export interface Project {
  id: string;
  company_id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  repositories?: ProjectRepository[];
  indexation_status?: "completed" | "in_progress" | "pending" | "failed";
}

export interface ProjectsResponse {
  projects: Project[];
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  repositories: {
    github_repo_id: number;
  }[];
}

export interface CreateProjectResponse {
  message: string;
  project: Project;
}
