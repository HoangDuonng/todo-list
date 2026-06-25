import React, { memo, useMemo, useState } from "react";
import { ITodoItem } from "../models/todo";
import { Check, Edit2, Trash2 } from "lucide-react";
import DeleteWarningDialog from "./DeleteWarningDialog";

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
  console.log("item::::::::", item.title);

  const handleUpdate = async () => {
    await onUpdate(item.id, value);
    setEditMode(false);
  };

  return (
    <div className="flex items-start justify-center bg-white dark:bg-gray-800 border border-gray-150 dark:border-none shadow-sm rounded p-4 text-gray-800 dark:text-gray-200 transition-colors duration-200">
      {editMode ? (
        <div className="flex w-full justify-center items-center">
          <input
            onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
            type="text"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a new task..."
            className="flex-grow bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded px-4 py-1 border border-gray-200 dark:border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleUpdate}
            className="ml-2 text-gray-500 dark:text-gray-400 hover:text-green-500 flex-shrink-0"
          >
            <Check size={18} />
          </button>
        </div>
      ) : (
        <>
          <button
            // onClick={() => toggleTodo(index)}
            className={`w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0 transition-colors duration-200 ${
              isDone ? "bg-purple-500 border-purple-500" : "border-blue-500"
            }`}
            onClick={() => (isDone ? onDoing(item.id) : onDone(item.id))}
          >
            {item.status === "done" && (
              <svg
                className="w-3 h-3 text-white mx-auto"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </button>

          <div className="flex flex-col flex-1">
            <p
              className={`flex-grow break-words cursor-pointer ${
                isDone ? "line-through text-gray-400 dark:text-gray-500 text-base" : "text-gray-800 dark:text-gray-200"
              }`}
              onClick={() => (isDone ? onDoing(item.id) : onDone(item.id))}
            >
              {item.title}
            </p>
            <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Author:{" "}
              <span className="font-medium text-gray-650 dark:text-gray-300">
                {item.user.first_name} {item.user.last_name}
              </span>
            </div>
          </div>
          <button
            onClick={() => setEditMode(true)}
            className="ml-2 text-gray-450 hover:text-blue-500 dark:hover:text-blue-400 flex-shrink-0 transition-colors duration-150"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => setOpen(true)}
            className="ml-2 text-gray-450 hover:text-red-500 flex-shrink-0 transition-colors duration-150"
          >
            <Trash2 size={18} />
          </button>
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
