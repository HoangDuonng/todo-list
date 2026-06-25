import { useCallback, useEffect, useMemo, useState } from "react";
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
import { enqueueSnackbar } from "notistack";
import { AxiosError } from "axios";
import { ErrorResponse } from "react-router-dom";
import { HandleError } from "../../core/services/axios";
import { useAuth } from "../../auth/hooks/useAuth";

const TodoList = () => {
  const [todos, setTodos] = useState<ITodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const { profile } = useAuth();

  const handleGetTasks = async () => {
    try {
      const result = await ListTodoAPI<IPagination<ITodoItem>>();
      setTodos(result.data);
    } catch (error) {
      enqueueSnackbar(
        HandleError(error as Error | AxiosError<ErrorResponse>).message,
        {
          variant: "error",
        }
      );
    }
  };

  useEffect(() => {
    (async () => {
      await handleGetTasks();
    })();
  }, []);

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.status === "done").length,
    [todos]
  );

  const handleDeleteTask = useCallback(async (id: string) => {
    try {
      if (id) {
        await DeleteTodoAPI(id);
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      enqueueSnackbar(
        HandleError(error as Error | AxiosError<ErrorResponse>).message,
        {
          variant: "error",
        }
      );
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
    } catch (error) {
      enqueueSnackbar(
        HandleError(error as Error | AxiosError<ErrorResponse>).message,
        {
          variant: "error",
        }
      );
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
    } catch (error) {
      enqueueSnackbar(
        HandleError(error as Error | AxiosError<ErrorResponse>).message,
        {
          variant: "error",
        }
      );
    }
  }, []);

  const handleUpdateTask = useCallback(async (id: string, title: string) => {
    try {
      if (!title || title.length <= 0) {
        enqueueSnackbar("Title cannot be blank", { variant: "error" });
        return;
      }

      await UpdateTodoAPI(id, title);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, title } : todo))
      );
    } catch (error) {
      enqueueSnackbar(
        HandleError(error as Error | AxiosError<ErrorResponse>).message,
        {
          variant: "error",
        }
      );
    }
  }, []);

  const handleAddTask = useCallback(async () => {
    try {
      if (!newTodo || newTodo.length <= 0) {
        enqueueSnackbar("Title cannot be blank", { variant: "error" });
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
    } catch (error) {
      enqueueSnackbar(
        HandleError(error as Error | AxiosError<ErrorResponse>).message,
        {
          variant: "error",
        }
      );
    }
  }, [newTodo, profile]);

  console.log("render");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-300 py-8 transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-center mb-8 w-full">
          <img src={Logo} alt="logo" className="dark:invert" />
        </div>

        <div className="flex mb-6">
          <input
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter a new task..."
            className="flex-grow bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-none rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r transition duration-200"
          >
            Add
          </button>
        </div>

        <div className="flex justify-between text-sm mb-4">
          <span>
            Total task{" "}
            <span className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full ml-1 transition-colors duration-200">
              {todos.length}
            </span>
          </span>
          <span className="text-purple-650 dark:text-purple-400">
            Completed{" "}
            <span className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full ml-1 transition-colors duration-200">
              {completedCount} of {todos.length}
            </span>
          </span>
        </div>

        <div className="space-y-2">
          {todos.map((todo, index) => (
            <TodoItem
              item={todo}
              key={index}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onDone={handleDoneTask}
              onDoing={handleDoingTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
