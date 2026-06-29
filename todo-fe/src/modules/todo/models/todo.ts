import { IProfile } from "../../auth/models/auth";

export type TodoPriority = "urgent" | "medium" | "low";

export type ITodoItem = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  status: "doing" | "done";
  priority: TodoPriority;
  user: IProfile;
};

