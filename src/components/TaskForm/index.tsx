"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useTask } from "@/context/task.context";
import { type TaskFormProps, taskFormSchema } from "@/schema/task.schema";
import { SelectPriority } from "../SelectPriority";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function TaskForm() {
  const { createNewTask } = useTask();

  const form = useForm<TaskFormProps>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      taskName: "",
      priority: "none",
    },
  });
  const { register, handleSubmit, control, formState, reset, watch } = form;
  const value = watch("taskName")
  const { errors } = formState;

  async function handleCreateTask(data: TaskFormProps) {
    await createNewTask(data);
    reset();
  }

  return (
    <div className="w-xl">
      <form
        onSubmit={handleSubmit(handleCreateTask)}
        className="flex gap-2 items-center"
      >
        <Input placeholder="Enter new task" value={value ?? ""} {...register("taskName")} />

        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <SelectPriority value={field.value} onChange={field.onChange} />
          )}
        />
        <Button className="cursor-pointer">Save</Button>
      </form>
      {errors.taskName && (
        <Alert variant="destructive" className="bg-red-50 mt-3">
          <AlertCircleIcon />
          <AlertDescription>{errors.taskName?.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
