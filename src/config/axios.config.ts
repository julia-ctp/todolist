import axios from "axios";

export const api = axios.create({
  baseURL: "https://69286343b35b4ffc501580de.mockapi.io/todo/v1/tasks",
});
