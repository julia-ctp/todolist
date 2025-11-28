"use client";
import React from "react";
import type { TaskFormProps, TaskTableProps } from "@/schema/task.schema";
import { taskServiceInstance } from "@/service/task.service";

interface TaskContextProps {
  task: TaskTableProps | null;
  tasks: TaskTableProps[];
  setTasks: React.SetStateAction<React.Dispatch<TaskTableProps[]>>;
  createNewTask: (data: TaskFormProps) => Promise<void>;
  checkTask: (task: TaskTableProps, checked: string | boolean) => Promise<void>;
  getAllTasks: () => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, task: TaskFormProps) => Promise<void>;
  getTaskById: (id: string) => Promise<void>;
}

export const TaskContext = React.createContext<TaskContextProps | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = React.useState<TaskTableProps[]>([]);
  const [task, setTask] = React.useState<TaskTableProps | null>(null);

  const getAllTasks = React.useCallback(async () => {
    const data = await taskServiceInstance.getAllTask();
    setTasks(data);
  }, []);

  async function createNewTask(data: TaskFormProps) {
    const _response = await taskServiceInstance.postTask(data);
    await getAllTasks();
  }

  async function checkTask(task: TaskTableProps, checked: string | boolean) {
    await taskServiceInstance.checkTask(task, checked);
    await getAllTasks();
  }

  async function deleteTask(id: string) {
    await taskServiceInstance.deleteTask(id);
    await getAllTasks();
  }

  async function getTaskById(id: string) {
    const data = await taskServiceInstance.getTaskById(id);
    setTask(data);
  }

  async function updateTask(id: string | undefined | null, task: TaskFormProps) {
    if(id) {
      await taskServiceInstance.updateTask(id, task);
    }
    await getAllTasks();
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        createNewTask,
        getAllTasks,
        checkTask,
        deleteTask,
        getTaskById,
        task,
        updateTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const useTaskContext = React.useContext(TaskContext);
  if (!useTaskContext) {
    throw new Error("Task context error");
  }
  return useTaskContext;
};
