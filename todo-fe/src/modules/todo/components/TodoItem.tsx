import React, { memo, useMemo, useState } from "react";
import { ITodoItem, TodoPriority, parseTaskDescription, serializeTaskDescription } from "../models/todo";
import { Check, Edit2, Trash2, GripVertical } from "lucide-react";
import DeleteWarningDialog from "./DeleteWarningDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TodoItemProps {
  item: ITodoItem;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, title: string, description?: string) => Promise<void>;
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

  // Parse priority and description
  const { priority, descriptionText } = useMemo(() => {
    return parseTaskDescription(item.description);
  }, [item.description]);

  const [editPriority, setEditPriority] = useState<TodoPriority>(priority);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleStartEdit = () => {
    setValue(item.title);
    setEditPriority(priority);
    setEditMode(true);
  };

  const handleUpdate = async () => {
    const serialized = serializeTaskDescription(editPriority, descriptionText);
    await onUpdate(item.id, value, serialized);
    setEditMode(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between bg-card hover:bg-accent/35 border border-border rounded-lg p-4 transition-all duration-200 shadow-sm ${
        isDragging ? "z-50 relative border-primary" : ""
      }`}
    >
      {editMode ? (
        <div className="flex flex-col w-full gap-2">
          <div className="flex w-full justify-center items-center gap-2">
            <Input
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
              type="text"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter a new task..."
              className="flex-grow h-9 text-sm"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={handleUpdate}
              className="text-green-600 hover:text-green-700 hover:bg-green-100/50 dark:hover:bg-green-900/30 h-9 w-9 shrink-0"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground font-medium">Độ ưu tiên:</span>
            <div className="flex gap-1.5">
              {(["low", "medium", "urgent"] as TodoPriority[]).map((p) => {
                let activeClass = "";
                let inactiveClass = "border-muted-foreground/30 text-muted-foreground hover:bg-accent";
                if (p === "low") {
                  activeClass = "bg-blue-500/10 text-blue-500 border-blue-500/30 dark:bg-blue-500/20";
                } else if (p === "medium") {
                  activeClass = "bg-yellow-500/10 text-yellow-600 border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-400";
                } else {
                  activeClass = "bg-red-500/10 text-red-500 border-red-500/30 dark:bg-red-500/20";
                }
                const label = p === "low" ? "Thấp" : p === "medium" ? "Trung bình" : "Khẩn cấp";
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setEditPriority(p)}
                    className={`px-2 py-0.5 rounded border text-[11px] transition-all font-semibold ${
                      editPriority === p ? activeClass : inactiveClass
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent shrink-0 cursor-grab active:cursor-grabbing focus-visible:ring-0"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </Button>

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

            <div className="flex flex-col min-w-0 flex-1 ml-1">
              <div className="flex items-center gap-2 flex-wrap">
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
                {priority === "urgent" && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-500/10 text-red-500 border border-red-500/20 dark:bg-red-500/20 shadow-sm animate-pulse">
                    Khẩn cấp
                  </span>
                )}
                {priority === "medium" && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 dark:bg-yellow-500/20 dark:text-yellow-400">
                    Trung bình
                  </span>
                )}
                {priority === "low" && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 dark:bg-blue-500/20">
                    Thấp
                  </span>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground mt-0.5 select-none">
                Author: {item.user.first_name} {item.user.last_name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleStartEdit}
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
