import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { IssueTable } from "@/components/IssueTable";
import { Issues } from "@/lib/api";
import type { Issue } from "@/types";

// Mock the API
jest.mock("@/lib/api");
const mockIssues = Issues as jest.Mocked<typeof Issues>;

const mockIssuesData: Issue[] = [
  {
    id: 1,
    project_id: 1,
    title: "Test Issue 1",
    description: "Description for test issue 1",
    assigned_to: "John Doe",
    status: "to_do",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
  {
    id: 2,
    project_id: 1,
    title: "Test Issue 2",
    description: "Description for test issue 2",
    assigned_to: "Jane Smith",
    status: "active",
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-04T00:00:00Z",
  },
];

describe("IssueTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading spinner initially", () => {
    mockIssues.list.mockReturnValue(new Promise(() => {})); // Never resolves
    render(<IssueTable projectId={1} />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders issues after loading", async () => {
    mockIssues.list.mockResolvedValue(mockIssuesData);

    render(<IssueTable projectId={1} />);

    await waitFor(() => {
      expect(screen.getAllByText("Test Issue 1")).toHaveLength(2); // Desktop and mobile views
      expect(screen.getAllByText("Test Issue 2")).toHaveLength(2); // Desktop and mobile views
      expect(screen.getAllByText("John Doe")).toHaveLength(2); // Desktop and mobile views
      expect(screen.getAllByText("Jane Smith")).toHaveLength(2); // Desktop and mobile views
    });
  });

  it("renders empty state when no issues", async () => {
    mockIssues.list.mockResolvedValue([]);

    render(<IssueTable projectId={1} />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "No issues found. Create your first issue to get started."
        )
      ).toBeInTheDocument();
    });
  });

  it("renders error message on API failure", async () => {
    mockIssues.list.mockRejectedValue(new Error("Failed to load issues"));

    render(<IssueTable projectId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load issues")).toBeInTheDocument();
    });
  });

  it("displays correct status badges", async () => {
    mockIssues.list.mockResolvedValue(mockIssuesData);

    render(<IssueTable projectId={1} />);

    await waitFor(() => {
      expect(screen.getAllByText("To do")).toHaveLength(2); // Desktop and mobile views
      expect(screen.getAllByText("Active")).toHaveLength(2); // Desktop and mobile views
    });
  });

  it("shows action buttons for each issue", async () => {
    mockIssues.list.mockResolvedValue(mockIssuesData);

    render(<IssueTable projectId={1} />);

    await waitFor(() => {
      // In desktop view, should have Edit and Delete buttons for each issue
      const editButtons = screen.getAllByText("Edit");
      const deleteButtons = screen.getAllByText("Delete");

      expect(editButtons.length).toBeGreaterThan(0);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  it("handles issue deletion", async () => {
    mockIssues.list.mockResolvedValue(mockIssuesData);
    mockIssues.destroy.mockResolvedValue(undefined);

    // Mock window.confirm to return true
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);

    render(<IssueTable projectId={1} />);

    await waitFor(() => {
      expect(screen.getAllByText("Test Issue 1")).toHaveLength(2); // Desktop and mobile views
    });

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    expect(confirmSpy).toHaveBeenCalledWith(
      'Are you sure you want to delete "Test Issue 1"?'
    );

    await waitFor(() => {
      expect(mockIssues.destroy).toHaveBeenCalledWith(1, 1);
    });

    confirmSpy.mockRestore();
  });

  it("displays issue numbers correctly", async () => {
    mockIssues.list.mockResolvedValue(mockIssuesData);

    render(<IssueTable projectId={1} />);

    await waitFor(() => {
      expect(screen.getAllByText("#1")).toHaveLength(2); // Desktop and mobile views
      expect(screen.getAllByText("#2")).toHaveLength(2); // Desktop and mobile views
    });
  });

  it("formats dates correctly", async () => {
    mockIssues.list.mockResolvedValue(mockIssuesData);

    render(<IssueTable projectId={1} />);

    await waitFor(() => {
      // Check that dates are formatted as locale date strings
      const formattedDate1 = new Date(
        "2024-01-01T00:00:00Z"
      ).toLocaleDateString();
      const formattedDate2 = new Date(
        "2024-01-03T00:00:00Z"
      ).toLocaleDateString();

      expect(screen.getAllByText(formattedDate1)).toHaveLength(2); // Desktop and mobile views
      expect(screen.getAllByText(formattedDate2)).toHaveLength(2); // Desktop and mobile views
    });
  });
});
