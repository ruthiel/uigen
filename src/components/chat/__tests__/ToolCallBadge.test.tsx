import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolCallBadge } from "../ToolCallBadge";

describe("ToolCallBadge", () => {
  describe("str_replace_editor tool", () => {
    it("displays 'Creating' message for create command", () => {
      const toolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
        result: "success",
        args: {
          command: "create",
          path: "/components/Button.jsx",
        },
      };

      render(<ToolCallBadge toolInvocation={toolInvocation} />);
      const element = screen.getByText("Creating /components/Button.jsx");
      expect(element).toBeDefined();
    });

    it("displays 'Editing' message for str_replace command", () => {
      const toolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
        result: "success",
        args: {
          command: "str_replace",
          path: "/App.jsx",
        },
      };

      render(<ToolCallBadge toolInvocation={toolInvocation} />);
      const element = screen.getByText("Editing /App.jsx");
      expect(element).toBeDefined();
    });

    it("displays 'Inserting into' message for insert command", () => {
      const toolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
        result: "success",
        args: {
          command: "insert",
          path: "/utils/helpers.js",
        },
      };

      render(<ToolCallBadge toolInvocation={toolInvocation} />);
      const element = screen.getByText("Inserting into /utils/helpers.js");
      expect(element).toBeDefined();
    });

    it("displays 'Viewing' message for view command", () => {
      const toolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
        result: "success",
        args: {
          command: "view",
          path: "/components/Header.tsx",
        },
      };

      render(<ToolCallBadge toolInvocation={toolInvocation} />);
      const element = screen.getByText("Viewing /components/Header.tsx");
      expect(element).toBeDefined();
    });

    it("displays 'Undoing changes' message for undo_edit command", () => {
      const toolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
        result: "success",
        args: {
          command: "undo_edit",
          path: "/App.jsx",
        },
      };

      render(<ToolCallBadge toolInvocation={toolInvocation} />);
      const element = screen.getByText("Undoing changes to /App.jsx");
      expect(element).toBeDefined();
    });
  });

  describe("file_manager tool", () => {
    it("displays 'Creating directory' message for create_directory command", () => {
      const toolInvocation = {
        toolName: "file_manager",
        state: "result",
        result: "success",
        args: {
          command: "create_directory",
          path: "/components",
        },
      };

      render(<ToolCallBadge toolInvocation={toolInvocation} />);
      const element = screen.getByText("Creating directory /components");
      expect(element).toBeDefined();
    });

    it("displays 'Deleting' message for delete command", () => {
      const toolInvocation = {
        toolName: "file_manager",
        state: "result",
        result: "success",
        args: {
          command: "delete",
          path: "/old-file.js",
        },
      };

      render(<ToolCallBadge toolInvocation={toolInvocation} />);
      const element = screen.getByText("Deleting /old-file.js");
      expect(element).toBeDefined();
    });

    it("displays 'Renaming' message for rename command", () => {
      const toolInvocation = {
        toolName: "file_manager",
        state: "result",
        result: "success",
        args: {
          command: "rename",
          path: "/old-name.js",
        },
      };

      render(<ToolCallBadge toolInvocation={toolInvocation} />);
      const element = screen.getByText("Renaming /old-name.js");
      expect(element).toBeDefined();
    });

    it("displays 'Listing' message for list command", () => {
      const toolInvocation = {
        toolName: "file_manager",
        state: "result",
        result: "success",
        args: {
          command: "list",
          path: "/components",
        },
      };

      render(<ToolCallBadge toolInvocation={toolInvocation} />);
      const element = screen.getByText("Listing /components");
      expect(element).toBeDefined();
    });

    it("displays 'Listing /' for list command with no path", () => {
      const toolInvocation = {
        toolName: "file_manager",
        state: "result",
        result: "success",
        args: {
          command: "list",
        },
      };

      render(<ToolCallBadge toolInvocation={toolInvocation} />);
      const element = screen.getByText("Listing /");
      expect(element).toBeDefined();
    });
  });

  describe("loading state", () => {
    it("shows spinner when tool is not complete", () => {
      const toolInvocation = {
        toolName: "str_replace_editor",
        state: "pending",
        args: {
          command: "create",
          path: "/App.jsx",
        },
      };

      const { container } = render(<ToolCallBadge toolInvocation={toolInvocation} />);
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeDefined();
    });

    it("shows green dot when tool is complete", () => {
      const toolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
        result: "success",
        args: {
          command: "create",
          path: "/App.jsx",
        },
      };

      const { container } = render(<ToolCallBadge toolInvocation={toolInvocation} />);
      const greenDot = container.querySelector(".bg-emerald-500");
      expect(greenDot).toBeDefined();
    });
  });

  describe("fallback behavior", () => {
    it("displays tool name when args are missing", () => {
      const toolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
        result: "success",
      };

      render(<ToolCallBadge toolInvocation={toolInvocation} />);
      const element = screen.getByText("str_replace_editor");
      expect(element).toBeDefined();
    });

    it("displays tool name for unknown tool", () => {
      const toolInvocation = {
        toolName: "unknown_tool",
        state: "result",
        result: "success",
        args: { foo: "bar" },
      };

      render(<ToolCallBadge toolInvocation={toolInvocation} />);
      const element = screen.getByText("unknown_tool");
      expect(element).toBeDefined();
    });
  });
});
