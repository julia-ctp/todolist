import TaskForm from "@/components/TaskForm";
import { TaskTable } from "@/components/TaskTable";
import { TaskProvider } from "@/context/task.context";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-semibold mb-8">TO DO</h1>
      <TaskProvider>
        <TaskForm />
        <TaskTable />
      </TaskProvider>
    </div>
  );
}
