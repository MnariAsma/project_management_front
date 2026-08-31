export interface User {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  avatar_url: string | null;
  github_id: string | null;
  company_id: string | null;
}
