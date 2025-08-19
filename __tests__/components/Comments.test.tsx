import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Comments } from "@/components/Comments";
import { Comments as CommentsAPI } from "@/lib/api";
import type { Comment } from "@/types";

// Mock the API
jest.mock("@/lib/api");
const mockComments = CommentsAPI as jest.Mocked<typeof CommentsAPI>;

const mockCommentsData: Comment[] = [
  {
    id: 1,
    issue_id: 1,
    text: "First comment",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    issue_id: 1,
    text: "Second comment",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
];

describe("Comments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading spinner initially", () => {
    mockComments.list.mockReturnValue(new Promise(() => {})); // Never resolves
    render(<Comments issueId={1} />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders comments after loading", async () => {
    mockComments.list.mockResolvedValue(mockCommentsData);

    render(<Comments issueId={1} />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
      expect(screen.getByText("Second comment")).toBeInTheDocument();
    });
  });

  it("renders empty state when no comments", async () => {
    mockComments.list.mockResolvedValue([]);

    render(<Comments issueId={1} />);

    await waitFor(() => {
      expect(
        screen.getByText("No comments yet. Be the first to add one!")
      ).toBeInTheDocument();
    });
  });

  it("renders error message on API failure", async () => {
    mockComments.list.mockRejectedValue(new Error("Failed to load comments"));

    render(<Comments issueId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load comments")).toBeInTheDocument();
    });
  });

  it("shows comment form", async () => {
    mockComments.list.mockResolvedValue([]);

    render(<Comments issueId={1} />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Add a comment...")
      ).toBeInTheDocument();
      expect(screen.getByText("Add Comment")).toBeInTheDocument();
    });
  });

  it("creates new comment when form is submitted", async () => {
    const user = userEvent.setup();
    const newComment: Comment = {
      id: 3,
      issue_id: 1,
      text: "New comment",
      created_at: "2024-01-03T00:00:00Z",
      updated_at: "2024-01-03T00:00:00Z",
    };

    mockComments.list.mockResolvedValue([]);
    mockComments.create.mockResolvedValue(newComment);

    render(<Comments issueId={1} />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Add a comment...")
      ).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText("Add a comment...");
    await user.type(textarea, "New comment");

    fireEvent.click(screen.getByText("Add Comment"));

    await waitFor(() => {
      expect(mockComments.create).toHaveBeenCalledWith(1, {
        text: "New comment",
      });
    });
  });

  it("clears form after successful comment creation", async () => {
    const user = userEvent.setup();
    const newComment: Comment = {
      id: 3,
      issue_id: 1,
      text: "New comment",
      created_at: "2024-01-03T00:00:00Z",
      updated_at: "2024-01-03T00:00:00Z",
    };

    mockComments.list.mockResolvedValue([]);
    mockComments.create.mockResolvedValue(newComment);

    render(<Comments issueId={1} />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Add a comment...")
      ).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText("Add a comment...");
    await user.type(textarea, "New comment");

    fireEvent.click(screen.getByText("Add Comment"));

    await waitFor(() => {
      expect(textarea).toHaveValue("");
    });
  });

  it("does not submit empty comments", async () => {
    mockComments.list.mockResolvedValue([]);

    render(<Comments issueId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Add Comment")).toBeInTheDocument();
    });

    // Try to submit without typing anything
    fireEvent.click(screen.getByText("Add Comment"));

    expect(mockComments.create).not.toHaveBeenCalled();
  });

  it("handles comment deletion", async () => {
    mockComments.list.mockResolvedValue(mockCommentsData);
    mockComments.destroy.mockResolvedValue(undefined);

    // Mock window.confirm to return true
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);

    render(<Comments issueId={1} />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    expect(confirmSpy).toHaveBeenCalledWith(
      "Are you sure you want to delete this comment?"
    );

    await waitFor(() => {
      expect(mockComments.destroy).toHaveBeenCalledWith(1, 1);
    });

    confirmSpy.mockRestore();
  });

  it("does not delete comment when user cancels", async () => {
    mockComments.list.mockResolvedValue(mockCommentsData);

    // Mock window.confirm to return false
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(false);

    render(<Comments issueId={1} />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    expect(confirmSpy).toHaveBeenCalledWith(
      "Are you sure you want to delete this comment?"
    );
    expect(mockComments.destroy).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it("formats timestamps correctly", async () => {
    mockComments.list.mockResolvedValue(mockCommentsData);

    render(<Comments issueId={1} />);

    await waitFor(() => {
      // Check that timestamps are formatted as locale strings
      const formattedDate1 = new Date("2024-01-01T00:00:00Z").toLocaleString();
      const formattedDate2 = new Date("2024-01-02T00:00:00Z").toLocaleString();

      expect(screen.getByText(formattedDate1)).toBeInTheDocument();
      expect(screen.getByText(formattedDate2)).toBeInTheDocument();
    });
  });

  it("shows loading state while submitting comment", async () => {
    const user = userEvent.setup();
    mockComments.list.mockResolvedValue([]);
    mockComments.create.mockReturnValue(new Promise(() => {})); // Never resolves

    render(<Comments issueId={1} />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Add a comment...")
      ).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText("Add a comment...");
    await user.type(textarea, "New comment");

    fireEvent.click(screen.getByText("Add Comment"));

    // Button should show loading state
    expect(screen.getByText("Adding...")).toBeInTheDocument();
  });
});
