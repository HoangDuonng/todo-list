import React, { memo, useMemo, useState } from "react";
import { ITodoItem } from "../models/todo";
import { Check, Edit2, Trash2 } from "lucide-react";
import DeleteWarningDialog from "./DeleteWarningDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TodoItemProps {
  item: ITodoItem;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, title: string) => Promise<void>;
  onDone: (id: string) => Promise<void>;
  onDoing: (id: string) => Promise<void>;
}

const TodoItem: React.FC<TodoItemProps> = ({
  item,
  onDelete,
  onUpdate,
  onDone,
  onDoing,
}) => {
  const isDone = useMemo(() => item.status === "done", [item]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(item.title);

  const handleUpdate = async () => {
    await onUpdate(item.id, value);
    setEditMode(false);
  };

  return (
    <div className="group flex items-center justify-between bg-card hover:bg-accent/35 border border-border rounded-lg p-4 transition-all duration-200 shadow-sm">
      {editMode ? (
        <div className="flex w-full justify-center items-center gap-2">
          <Input
            onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
            type="text"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a new task..."
            className="flex-grow h-9"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleUpdate}
            className="text-green-600 hover:text-green-750 hover:bg-green-100/50 dark:hover:bg-green-900/30 h-9 w-9 shrink-0"
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 focus:outline-none ${
                isDone 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "border-muted-foreground/50 hover:border-primary"
              }`}
              onClick={() => (isDone ? onDoing(item.id) : onDone(item.id))}
            >
              {isDone && (
                <svg
                  className="w-3 h-3 fill-none stroke-current"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              )}
            </button>

            <div className="flex flex-col min-w-0 flex-1">
              <p
                className={`text-sm font-medium break-words cursor-pointer select-none leading-relaxed transition-all duration-200 ${
                  isDone 
                    ? "line-through text-muted-foreground" 
                    : "text-foreground"
                }`}
                onClick={() => (isDone ? onDoing(item.id) : onDone(item.id))}
              >
                {item.title}
              </p>
              <span className="text-[11px] text-muted-foreground mt-0.5 select-none">
                Author: {item.user.first_name} {item.user.last_name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setEditMode(true)}
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-accent focus-visible:ring-0"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpen(true)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 focus-visible:ring-0"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </>
      )}

      <DeleteWarningDialog
        isOpen={open}
        onConfirm={async () => {
          await onDelete(item.id);
          setOpen(false);
        }}
        onClose={() => {
          setOpen(false);
        }}
      />
    </div>
  );
};

export default memo(TodoItem);
