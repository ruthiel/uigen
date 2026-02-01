import { Loader2 } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  state: string;
  result?: string;
  args?: Record<string, any>;
}

interface ToolCallBadgeProps {
  toolInvocation: ToolInvocation;
}

function formatToolMessage(toolName: string, args?: Record<string, any>): string {
  if (toolName === "str_replace_editor" && args) {
    const { command, path } = args;

    switch (command) {
      case "create":
        return `Creating ${path}`;
      case "str_replace":
        return `Editing ${path}`;
      case "insert":
        return `Inserting into ${path}`;
      case "view":
        return `Viewing ${path}`;
      case "undo_edit":
        return `Undoing changes to ${path}`;
      default:
        return `Modifying ${path}`;
    }
  }

  if (toolName === "file_manager" && args) {
    const { command, path } = args;

    switch (command) {
      case "create_directory":
        return `Creating directory ${path}`;
      case "delete":
        return `Deleting ${path}`;
      case "rename":
        return `Renaming ${path}`;
      case "list":
        return `Listing ${path || "/"}`;
      default:
        return `Managing ${path}`;
    }
  }

  return toolName;
}

export function ToolCallBadge({ toolInvocation }: ToolCallBadgeProps) {
  const message = formatToolMessage(toolInvocation.toolName, toolInvocation.args);
  const isComplete = toolInvocation.state === "result" && toolInvocation.result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isComplete ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}
