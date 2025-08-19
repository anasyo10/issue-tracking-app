import type {
  Project,
  Issue,
  Comment,
  CreateProjectData,
  CreateIssueData,
  CreateCommentData,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const config: RequestInit = {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const Projects = {
  list: () => api<Project[]>("/projects"),

  get: (id: number) => api<Project>(`/projects/${id}`),

  create: (data: CreateProjectData) =>
    api<Project>("/projects", {
      method: "POST",
      body: JSON.stringify({ project: data }),
    }),

  update: (id: number, data: CreateProjectData) =>
    api<Project>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify({ project: data }),
    }),

  destroy: (id: number) =>
    api<void>(`/projects/${id}`, {
      method: "DELETE",
    }),
};

export const Issues = {
  list: (projectId: number) => api<Issue[]>(`/projects/${projectId}/issues`),

  get: (projectId: number, id: number) =>
    api<Issue>(`/projects/${projectId}/issues/${id}`),

  create: (projectId: number, data: CreateIssueData) =>
    api<Issue>(`/projects/${projectId}/issues`, {
      method: "POST",
      body: JSON.stringify({ issue: data }),
    }),

  update: (projectId: number, id: number, data: CreateIssueData) =>
    api<Issue>(`/projects/${projectId}/issues/${id}`, {
      method: "PUT",
      body: JSON.stringify({ issue: data }),
    }),

  destroy: (projectId: number, id: number) =>
    api<void>(`/projects/${projectId}/issues/${id}`, {
      method: "DELETE",
    }),
};

export const Comments = {
  list: (issueId: number) => api<Comment[]>(`/issues/${issueId}/comments`),

  create: (issueId: number, data: CreateCommentData) =>
    api<Comment>(`/issues/${issueId}/comments`, {
      method: "POST",
      body: JSON.stringify({ comment: data }),
    }),

  destroy: (issueId: number, id: number) =>
    api<void>(`/issues/${issueId}/comments/${id}`, {
      method: "DELETE",
    }),
};
