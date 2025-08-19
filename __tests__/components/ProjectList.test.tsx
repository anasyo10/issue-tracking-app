import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ProjectList } from "@/components/ProjectList";
import { Projects } from "@/lib/api";
import type { Project } from "@/types";

// Mock the API
jest.mock("@/lib/api");
const mockProjects = Projects as jest.Mocked<typeof Projects>;

const mockProjectsData: Project[] = [
  {
    id: 1,
    name: "Test Project 1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
  {
    id: 2,
    name: "Test Project 2",
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-04T00:00:00Z",
  },
];

describe("ProjectList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading spinner initially", () => {
    mockProjects.list.mockReturnValue(new Promise(() => {})); // Never resolves
    render(<ProjectList />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders projects after loading", async () => {
    mockProjects.list.mockResolvedValue(mockProjectsData);

    render(<ProjectList />);

    await waitFor(() => {
      expect(screen.getAllByText("Test Project 1")).toHaveLength(2); // Desktop and mobile views
      expect(screen.getAllByText("Test Project 2")).toHaveLength(2); // Desktop and mobile views
    });
  });

  it("renders empty state when no projects", async () => {
    mockProjects.list.mockResolvedValue([]);

    render(<ProjectList />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "No projects found. Create your first project to get started."
        )
      ).toBeInTheDocument();
    });
  });

  it("renders error message on API failure", async () => {
    mockProjects.list.mockRejectedValue(new Error("Failed to fetch"));

    render(<ProjectList />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
    });
  });

  it("shows action buttons for each project", async () => {
    mockProjects.list.mockResolvedValue(mockProjectsData);

    render(<ProjectList />);

    await waitFor(() => {
      // Should have View, Edit, and Delete buttons for each project (desktop + mobile views)
      expect(screen.getAllByText("View")).toHaveLength(4); // 2 projects x 2 views
      expect(screen.getAllByText("Edit")).toHaveLength(4); // 2 projects x 2 views
      expect(screen.getAllByText("Delete")).toHaveLength(4); // 2 projects x 2 views
    });
  });

  it("handles project deletion", async () => {
    mockProjects.list.mockResolvedValue(mockProjectsData);
    mockProjects.destroy.mockResolvedValue(undefined);

    // Mock window.confirm to return true
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);

    render(<ProjectList />);

    await waitFor(() => {
      expect(screen.getAllByText("Test Project 1")).toHaveLength(2); // Desktop and mobile views
    });

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    expect(confirmSpy).toHaveBeenCalledWith(
      'Are you sure you want to delete "Test Project 1"?'
    );

    await waitFor(() => {
      expect(mockProjects.destroy).toHaveBeenCalledWith(1);
    });

    confirmSpy.mockRestore();
  });

  it("does not delete project when user cancels", async () => {
    mockProjects.list.mockResolvedValue(mockProjectsData);

    // Mock window.confirm to return false
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(false);

    render(<ProjectList />);

    await waitFor(() => {
      expect(screen.getAllByText("Test Project 1")).toHaveLength(2); // Desktop and mobile views
    });

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    expect(confirmSpy).toHaveBeenCalledWith(
      'Are you sure you want to delete "Test Project 1"?'
    );
    expect(mockProjects.destroy).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });
});
