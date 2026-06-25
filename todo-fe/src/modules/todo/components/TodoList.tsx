import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ITodoItem } from "../models/todo";
import TodoItem from "./TodoItem";
import Logo from "../../../assets/logo.svg";
import {
  CreateTodoAPI,
  DeleteTodoAPI,
  DoingTodoAPI,
  DoneTodoAPI,
  ListTodoAPI,
  UpdateTodoAPI,
} from "../services/api";
import { IPagination, IResponse } from "../../core/models/core";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ErrorResponse } from "react-router-dom";
import { HandleError } from "../../core/services/axios";
import { useAuth } from "../../auth/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

const TodoList = () => {
  const [todos, setTodos] = useState<ITodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const { profile } = useAuth();
  const [note, setNote] = useState("");
  const [noteTaskId, setNoteTaskId] = useState<string | null>(null);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const lastSavedNote = useRef<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleGetTasks = async () => {
    try {
      const result = await ListTodoAPI<IPagination<ITodoItem>>();
      const noteTask = result.data.find((todo) => todo.title === "__quick_note__");
      const normalTasks = result.data.filter((todo) => todo.title !== "__quick_note__");

      setTodos(normalTasks);
      if (noteTask) {
        const content = noteTask.description || "";
        setNote(content);
        lastSavedNote.current = content;
        setNoteTaskId(noteTask.id);
      } else {
        lastSavedNote.current = "";
      }
    } catch (error) {
      toast.error(HandleError(error as Error | AxiosError<ErrorResponse>).message);
    }
  };

  useEffect(() => {
    handleGetTasks();
  }, []);

  // Debounced auto-save for notes
  useEffect(() => {
    if (lastSavedNote.current === null) {
      return;
    }

    if (lastSavedNote.current === note) {
      return;
    }

    setIsSavingNote(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        if (noteTaskId) {
          await UpdateTodoAPI(noteTaskId, "__quick_note__", note);
          lastSavedNote.current = note;
        } else {
          const result = await CreateTodoAPI<IResponse<string>>("__quick_note__", note);
          setNoteTaskId(result.data);
          lastSavedNote.current = note;
        }
      } catch (error) {
        toast.error("Failed to save note: " + HandleError(error as Error).message);
      } finally {
        setIsSavingNote(false);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [note, noteTaskId]);

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.status === "done").length,
    [todos]
  );

  const handleDeleteTask = useCallback(async (id: string) => {
    try {
      if (id) {
        await DeleteTodoAPI(id);
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
        toast.success("Task deleted successfully");
      }
    } catch (error) {
      toast.error(HandleError(error as Error | AxiosError<ErrorResponse>).message);
    }
  }, []);

  const handleDoneTask = useCallback(async (id: string) => {
    try {
      await DoneTodoAPI(id);
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, status: "done" } : todo
        )
      );
      toast.success("Task marked as completed");
    } catch (error) {
      toast.error(HandleError(error as Error | AxiosError<ErrorResponse>).message);
    }
  }, []);

  const handleDoingTask = useCallback(async (id: string) => {
    try {
      await DoingTodoAPI(id);
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, status: "doing" } : todo
        )
      );
      toast.success("Task marked as in progress");
    } catch (error) {
      toast.error(HandleError(error as Error | AxiosError<ErrorResponse>).message);
    }
  }, []);

  const handleUpdateTask = useCallback(async (id: string, title: string) => {
    try {
      if (!title || title.trim().length === 0) {
        toast.error("Title cannot be blank");
        return;
      }

      await UpdateTodoAPI(id, title);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, title } : todo))
      );
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error(HandleError(error as Error | AxiosError<ErrorResponse>).message);
    }
  }, []);

  const handleAddTask = useCallback(async () => {
    try {
      if (!newTodo || newTodo.trim().length === 0) {
        toast.error("Title cannot be blank");
        return;
      }

      const result = await CreateTodoAPI<IResponse<string>>(newTodo);
      const t: ITodoItem = {
        id: result.data,
        title: newTodo,
        status: "doing",
        description: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: profile?.id || "",
          first_name: profile?.first_name || "",
          last_name: profile?.last_name || "",
          email: profile?.email || "",
          avatar: "",
          created_at: profile?.created_at || "",
          updated_at: profile?.updated_at || "",
        },
      };
      setTodos((prev) => [t, ...prev]);
      setNewTodo("");
      toast.success("Task added successfully");
    } catch (error) {
      toast.error(HandleError(error as Error | AxiosError<ErrorResponse>).message);
    }
  }, [newTodo, profile]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 py-4">
      <div className="flex justify-center w-full py-4">
        <img src={Logo} alt="logo" className="h-10 dark:invert transition-all hover:opacity-85" />
      </div>

      <Card className="w-full shadow-md border-border overflow-hidden">
        <Tabs defaultValue="tasks" className="w-full">
          <CardHeader className="pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border bg-muted/10">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">Todo Dashboard</CardTitle>
              <CardDescription>
                Manage your tasks and quick notes in real-time.
              </CardDescription>
            </div>
            <TabsList className="grid w-full sm:w-[240px] grid-cols-2">
              <TabsTrigger value="tasks" className="font-semibold">Tasks</TabsTrigger>
              <TabsTrigger value="notes" className="font-semibold">Notes</TabsTrigger>
            </TabsList>
          </CardHeader>

          <TabsContent value="tasks" className="mt-0 focus-visible:ring-0">
            <CardContent className="pt-6 flex flex-col gap-6">
              <div className="flex gap-2 w-full">
                <Input
                  onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="What needs to be done?"
                  className="flex-grow focus-visible:ring-1 focus-visible:ring-ring"
                />
                <Button onClick={handleAddTask} variant="default" className="px-5">
                  Add Task
                </Button>
              </div>

              <div className="flex justify-between items-center text-sm border-b pb-3 border-border">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">Total tasks</span>
                  <Badge variant="secondary" className="px-2 py-0.5 font-bold">
                    {todos.length}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">Completed</span>
                  <Badge variant="outline" className="px-2 py-0.5 border-primary text-primary font-bold">
                    {completedCount} of {todos.length}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-3 min-h-[200px]">
                {todos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-muted-foreground text-sm flex-grow min-h-[200px] border border-dashed rounded-lg border-border p-8">
                    No tasks available. Add some tasks to get started!
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={todos.map((todo) => todo.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {todos.map((todo, index) => (
                        <TodoItem
                          item={todo}
                          key={todo.id || index}
                          onUpdate={handleUpdateTask}
                          onDelete={handleDeleteTask}
                          onDone={handleDoneTask}
                          onDoing={handleDoingTask}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="notes" className="mt-0 focus-visible:ring-0">
            <CardContent className="pt-6 flex flex-col gap-6">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  {isSavingNote && (
                    <span className="text-xs text-muted-foreground animate-pulse bg-muted px-2 py-1 rounded">Saving...</span>
                  )}
                </div>
                {note && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setNote("");
                      toast.success("Note cleared");
                    }}
                    className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 animate-in fade-in duration-200"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Type or paste notes here..."
                className="min-h-[300px] resize-y focus-visible:ring-1 focus-visible:ring-ring text-sm leading-relaxed border-border/60"
              />
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default TodoList;
