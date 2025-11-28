import type { AxiosInstance } from "axios";
import { api } from "@/config/axios.config";
import type { TaskFormProps, TaskTableProps } from "@/schema/task.schema";

export class TaskService {
  private instance: AxiosInstance = api;

  async postTask(data: TaskFormProps) {
    try {
      const body = {
        ...data,
        active: true,
      };
      const response = await this.instance.post("/", body);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllTask() {
    try {
      const { data } = await this.instance.get("/");

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async checkTask(task: TaskTableProps, completed: boolean | string) {
    try {
      const body = {
        ...task,
        completed,
      };
      const { data } = await this.instance.put(`/${task.id}`, body);

      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteTask(id: string) {
    try {
      await this.instance.delete(`/${id}`);
    } catch (error) {
      console.log(error);
    }
  }

  async updateTask(id: string, task: TaskFormProps) {
    try {
      await this.instance.put(`/${id}`, task);
    } catch (error) {
      console.log(error);
    }
  }

  async getTaskById(id: string) {
    try {
      const { data } = await this.instance.get(`/${id}`);

      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

export const taskServiceInstance = new TaskService();
