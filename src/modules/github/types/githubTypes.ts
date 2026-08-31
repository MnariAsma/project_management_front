export interface GithubRepository {
  github_repo_id: number;
  name: string;
  owner: string;
  github_url: string;
  github_created_at: string;
  github_updated_at: string;
}

export interface GithubRepositoriesResponse {
  data: GithubRepository[];
}
