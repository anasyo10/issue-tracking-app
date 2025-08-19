import { Projects, Issues, Comments } from "@/lib/api";
import type { Project, Issue, Comment } from "@/types";

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("API Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  describe("Projects API", () => {
    it("fetches projects list", async () => {
      const mockProjects: Project[] = [
        {
          id: 1,
          name: "Test Project",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProjects,
      } as Response);

      const result = await Projects.list();

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3000/projects", {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });
      expect(result).toEqual(mockProjects);
    });

    it("creates a new project", async () => {
      const newProject: Project = {
        id: 1,
        name: "New Project",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => newProject,
      } as Response);

      const result = await Projects.create({ name: "New Project" });

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3000/projects", {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ project: { name: "New Project" } }),
      });
      expect(result).toEqual(newProject);
    });

    it("deletes a project", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      await Projects.destroy(1);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/projects/1",
        {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          method: "DELETE",
        }
      );
    });

    it("handles API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      } as Response);

      await expect(Projects.list()).rejects.toThrow("API Error: 404 Not Found");
    });
  });

  describe("Issues API", () => {
    it("fetches issues for a project", async () => {
      const mockIssues: Issue[] = [
        {
          id: 1,
          project_id: 1,
          title: "Test Issue",
          description: "Test description",
          assigned_to: "John Doe",
          status: "to_do",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockIssues,
      } as Response);

      const result = await Issues.list(1);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/projects/1/issues",
        {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      expect(result).toEqual(mockIssues);
    });

    it("creates a new issue", async () => {
      const newIssue: Issue = {
        id: 1,
        project_id: 1,
        title: "New Issue",
        description: "New description",
        assigned_to: "Jane Doe",
        status: "to_do",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => newIssue,
      } as Response);

      const issueData = {
        title: "New Issue",
        description: "New description",
        assigned_to: "Jane Doe",
        status: "to_do" as const,
      };

      const result = await Issues.create(1, issueData);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/projects/1/issues",
        {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ issue: issueData }),
        }
      );
      expect(result).toEqual(newIssue);
    });

    it("updates an issue", async () => {
      const updatedIssue: Issue = {
        id: 1,
        project_id: 1,
        title: "Updated Issue",
        description: "Updated description",
        assigned_to: "Jane Doe",
        status: "active",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedIssue,
      } as Response);

      const updateData = {
        title: "Updated Issue",
        description: "Updated description",
        assigned_to: "Jane Doe",
        status: "active" as const,
      };

      const result = await Issues.update(1, 1, updateData);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/projects/1/issues/1",
        {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify({ issue: updateData }),
        }
      );
      expect(result).toEqual(updatedIssue);
    });
  });

  describe("Comments API", () => {
    it("fetches comments for an issue", async () => {
      const mockComments: Comment[] = [
        {
          id: 1,
          issue_id: 1,
          text: "Test comment",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockComments,
      } as Response);

      const result = await Comments.list(1);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/issues/1/comments",
        {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      expect(result).toEqual(mockComments);
    });

    it("creates a new comment", async () => {
      const newComment: Comment = {
        id: 1,
        issue_id: 1,
        text: "New comment",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => newComment,
      } as Response);

      const result = await Comments.create(1, { text: "New comment" });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/issues/1/comments",
        {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ comment: { text: "New comment" } }),
        }
      );
      expect(result).toEqual(newComment);
    });
  });

  describe("Environment Configuration", () => {
    it("uses custom API base URL from environment", async () => {
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";

      // Re-import to get the new environment variable
      jest.resetModules();
      const { Projects: ProjectsWithCustomURL } = await import("@/lib/api");

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      await ProjectsWithCustomURL.list();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/projects",
        expect.any(Object)
      );

      // Restore original environment
      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      } else {
        delete process.env.NEXT_PUBLIC_API_BASE_URL;
      }
    });
  });
});
