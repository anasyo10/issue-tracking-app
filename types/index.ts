export type Project = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Issue = {
  id: number;
  project_id: number;
  title: string;
  description: string;
  assigned_to: string;
  status: "to_do" | "active" | "on_hold" | "resolved";
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: number;
  issue_id: number;
  text: string;
  created_at: string;
  updated_at: string;
};

export type CreateProjectData = {
  name: string;
};

export type CreateIssueData = {
  title: string;
  description: string;
  assigned_to: string;
  status: "to_do" | "active" | "on_hold" | "resolved";
};

export type CreateCommentData = {
  text: string;
};
