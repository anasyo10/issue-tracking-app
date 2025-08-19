import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IssueForm } from "@/components/IssueForm";
import { Issues } from "@/lib/api";
import { toast } from "sonner";
import type { Issue } from "@/types";

// Mock the API and dependencies
jest.mock("@/lib/api");
jest.mock("sonner");
const mockIssues = Issues as jest.Mocked<typeof Issues>;
const mockToast = toast as jest.Mocked<typeof toast>;

const mockIssueData: Issue = {
  id: 1,
  project_id: 1,
  title: "Test Issue",
  description: "Test description",
  assigned_to: "John Doe",
  status: "active",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-02T00:00:00Z",
};

describe("IssueForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Create Mode", () => {
    it("renders create form correctly", () => {
      render(<IssueForm projectId={1} />);

      expect(screen.getByText("Create New Issue")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter issue title")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter issue description")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter assignee name")
      ).toBeInTheDocument();
      expect(screen.getByText("Create Issue")).toBeInTheDocument();
    });

    it("creates new issue when form is submitted", async () => {
      const user = userEvent.setup();
      mockIssues.create.mockResolvedValue(mockIssueData);

      render(<IssueForm projectId={1} />);

      await user.type(
        screen.getByPlaceholderText("Enter issue title"),
        "New Issue"
      );
      await user.type(
        screen.getByPlaceholderText("Enter issue description"),
        "New description"
      );
      await user.type(
        screen.getByPlaceholderText("Enter assignee name"),
        "Jane Doe"
      );

      fireEvent.click(screen.getByText("Create Issue"));

      await waitFor(() => {
        expect(mockIssues.create).toHaveBeenCalledWith(1, {
          title: "New Issue",
          description: "New description",
          assigned_to: "Jane Doe",
          status: "to_do",
        });
      });
    });

    it("validates required fields", async () => {
      const user = userEvent.setup();

      render(<IssueForm projectId={1} />);

      // Submit without filling required fields
      fireEvent.click(screen.getByText("Create Issue"));

      // Form should not submit (button should be disabled)
      expect(mockIssues.create).not.toHaveBeenCalled();
    });
  });

  describe("Edit Mode", () => {
    it("renders edit form correctly", async () => {
      mockIssues.get.mockResolvedValue(mockIssueData);

      render(<IssueForm projectId={1} issueId={1} />);

      await waitFor(() => {
        expect(screen.getByText("Edit Test Issue")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Test Issue")).toBeInTheDocument();
        expect(
          screen.getByDisplayValue("Test description")
        ).toBeInTheDocument();
        expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Update Issue")).toBeInTheDocument();
      });
    });

    it("loads existing issue data", async () => {
      mockIssues.get.mockResolvedValue(mockIssueData);

      render(<IssueForm projectId={1} issueId={1} />);

      await waitFor(() => {
        expect(mockIssues.get).toHaveBeenCalledWith(1, 1);
      });
    });

    it("updates issue when form is submitted", async () => {
      const user = userEvent.setup();
      mockIssues.get.mockResolvedValue(mockIssueData);
      mockIssues.update.mockResolvedValue(mockIssueData);

      render(<IssueForm projectId={1} issueId={1} />);

      await waitFor(() => {
        expect(screen.getByDisplayValue("Test Issue")).toBeInTheDocument();
      });

      const titleInput = screen.getByDisplayValue("Test Issue");
      await user.clear(titleInput);
      await user.type(titleInput, "Updated Issue");

      fireEvent.click(screen.getByText("Update Issue"));

      await waitFor(() => {
        expect(mockIssues.update).toHaveBeenCalledWith(1, 1, {
          title: "Updated Issue",
          description: "Test description",
          assigned_to: "John Doe",
          status: "active",
        });
      });
    });

    it("shows success toast after update", async () => {
      mockIssues.get.mockResolvedValue(mockIssueData);
      mockIssues.update.mockResolvedValue(mockIssueData);
      mockToast.success = jest.fn();

      render(<IssueForm projectId={1} issueId={1} />);

      await waitFor(() => {
        expect(screen.getByText("Update Issue")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Update Issue"));

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          "Issue updated successfully!"
        );
      });
    });

    it("displays created at date in edit mode", async () => {
      mockIssues.get.mockResolvedValue(mockIssueData);

      render(<IssueForm projectId={1} issueId={1} />);

      await waitFor(() => {
        expect(screen.getByText("Created At:")).toBeInTheDocument();
        const formattedDate = new Date(
          mockIssueData.created_at
        ).toLocaleDateString();
        expect(screen.getByText(formattedDate)).toBeInTheDocument();
      });
    });
  });

  describe("Status Selection", () => {
    it("renders status field with default value", async () => {
      render(<IssueForm projectId={1} />);

      // Should show default status value (in select display and option)
      await waitFor(() => {
        expect(screen.getAllByText("To do")).toHaveLength(2); // Select display and option element
      });
    });
  });

  describe("Error Handling", () => {
    it("displays error message on API failure", async () => {
      mockIssues.get.mockRejectedValue(new Error("Failed to load issue"));

      render(<IssueForm projectId={1} issueId={1} />);

      await waitFor(() => {
        expect(screen.getByText("Failed to load issue")).toBeInTheDocument();
      });
    });

    it("displays error message on create failure", async () => {
      const user = userEvent.setup();
      mockIssues.create.mockRejectedValue(new Error("Failed to create issue"));

      render(<IssueForm projectId={1} />);

      await user.type(
        screen.getByPlaceholderText("Enter issue title"),
        "New Issue"
      );
      await user.type(
        screen.getByPlaceholderText("Enter assignee name"),
        "Jane Doe"
      );

      fireEvent.click(screen.getByText("Create Issue"));

      await waitFor(() => {
        expect(screen.getByText("Failed to create issue")).toBeInTheDocument();
      });
    });
  });
});
