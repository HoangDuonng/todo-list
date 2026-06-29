import { IProfile } from "../../auth/models/auth";

export type TodoPriority = "urgent" | "medium" | "low";

export type ITodoItem = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  status: "doing" | "done";
  user: IProfile;
};

export interface ITodoItemExtended extends ITodoItem {
  priority: TodoPriority;
  rawDescriptionText: string;
}

export function parseTaskDescription(rawDescription: string): {
  priority: TodoPriority;
  descriptionText: string;
} {
  if (!rawDescription) {
    return { priority: "medium", descriptionText: "" };
  }

  const match = rawDescription.match(/^\[Priority:\s*(urgent|medium|low)\]([\s\S]*)$/i);
  if (match) {
    return {
      priority: match[1].toLowerCase() as TodoPriority,
      descriptionText: match[2],
    };
  }

  return {
    priority: "medium",
    descriptionText: rawDescription,
  };
}

export function serializeTaskDescription(priority: TodoPriority, descriptionText: string): string {
  return `[Priority: ${priority}]${descriptionText || ""}`;
}

