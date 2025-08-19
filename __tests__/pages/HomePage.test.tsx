import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

// Mock the ProjectList component since it has its own tests
jest.mock("@/components/ProjectList", () => {
  return {
    ProjectList: () => (
      <div data-testid="project-list">ProjectList Component</div>
    ),
  };
});

describe("HomePage", () => {
  it("renders the main heading", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "Projects" })
    ).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<HomePage />);

    expect(
      screen.getByText("Manage your projects and track issues")
    ).toBeInTheDocument();
  });

  it("renders create new project button", () => {
    render(<HomePage />);

    const createButton = screen.getByRole("link", {
      name: "+ Create new project",
    });
    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveAttribute("href", "/projects/new");
  });

  it("renders ProjectList component", () => {
    render(<HomePage />);

    expect(screen.getByTestId("project-list")).toBeInTheDocument();
  });

  it("has proper layout structure", () => {
    render(<HomePage />);

    // Check for main container - go up two levels to the container div
    const container = screen.getByText("Projects").closest("div")
      ?.parentElement?.parentElement;
    expect(container).toHaveClass("container", "mx-auto", "p-4", "space-y-6");
  });

  it("has responsive header layout", () => {
    render(<HomePage />);

    // Check that header section exists with responsive classes
    const headerSection = screen
      .getByText("Projects")
      .closest("div")?.parentElement;
    expect(headerSection).toHaveClass("flex", "flex-col", "sm:flex-row");
  });
});
