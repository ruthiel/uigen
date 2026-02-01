import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MainContent } from "../main-content";

vi.mock("@/components/chat/ChatInterface", () => ({
  ChatInterface: () => <div data-testid="chat-interface">Chat</div>,
}));

vi.mock("@/components/editor/FileTree", () => ({
  FileTree: () => <div data-testid="file-tree">FileTree</div>,
}));

vi.mock("@/components/editor/CodeEditor", () => ({
  CodeEditor: () => <div data-testid="code-editor">CodeEditor</div>,
}));

vi.mock("@/components/preview/PreviewFrame", () => ({
  PreviewFrame: () => <div data-testid="preview-frame">PreviewFrame</div>,
}));

vi.mock("@/components/HeaderActions", () => ({
  HeaderActions: () => <div data-testid="header-actions">HeaderActions</div>,
}));

describe("MainContent", () => {
  it("renders with preview view by default", () => {
    render(<MainContent />);

    expect(screen.getByTestId("preview-frame")).toBeInTheDocument();
    expect(screen.queryByTestId("file-tree")).not.toBeInTheDocument();
    expect(screen.queryByTestId("code-editor")).not.toBeInTheDocument();
  });

  it("switches to code view when Code tab is clicked", () => {
    render(<MainContent />);

    const codeTab = screen.getByRole("tab", { name: /code/i });
    fireEvent.click(codeTab);

    expect(screen.getByTestId("file-tree")).toBeInTheDocument();
    expect(screen.getByTestId("code-editor")).toBeInTheDocument();
    expect(screen.queryByTestId("preview-frame")).not.toBeInTheDocument();
  });

  it("switches back to preview view when Preview tab is clicked", () => {
    render(<MainContent />);

    const codeTab = screen.getByRole("tab", { name: /code/i });
    fireEvent.click(codeTab);

    const previewTab = screen.getByRole("tab", { name: /preview/i });
    fireEvent.click(previewTab);

    expect(screen.getByTestId("preview-frame")).toBeInTheDocument();
    expect(screen.queryByTestId("file-tree")).not.toBeInTheDocument();
    expect(screen.queryByTestId("code-editor")).not.toBeInTheDocument();
  });

  it("maintains proper ARIA attributes for accessibility", () => {
    render(<MainContent />);

    const previewTab = screen.getByRole("tab", { name: /preview/i });
    const codeTab = screen.getByRole("tab", { name: /code/i });

    expect(previewTab).toHaveAttribute("aria-selected", "true");
    expect(codeTab).toHaveAttribute("aria-selected", "false");

    fireEvent.click(codeTab);

    expect(previewTab).toHaveAttribute("aria-selected", "false");
    expect(codeTab).toHaveAttribute("aria-selected", "true");
  });

  it("renders tab panels with proper roles", () => {
    render(<MainContent />);

    const tabPanels = screen.getAllByRole("tabpanel");
    expect(tabPanels).toHaveLength(1); // Only active panel should be rendered
  });
});
