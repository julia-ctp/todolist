"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTask } from "@/context/task.context";
import { type TaskFormProps, taskFormSchema } from "@/schema/task.schema";
import { SelectPriority } from "../SelectPriority";

interface TaskEditFormProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TaskEditModal({ isOpen, setIsOpen }: TaskEditFormProps) {
  const { task, updateTask } = useTask();

  const form = useForm<TaskFormProps>({
    resolver: zodResolver(taskFormSchema),
  });
  const { register, handleSubmit, control, reset } = form;

  async function handleEdit(data: TaskFormProps) {
    if (task?.id) {
      await updateTask(task.id, data);
      setIsOpen(false);
    }
  }

  React.useEffect(() => {
    if (task) {
      reset(task);
    }
  }, [task, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(handleEdit)} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="text-center">Edit task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input id="taskName" {...register("taskName")} />
            </div>
            <div className="grid gap-3">
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <SelectPriority
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
              />
            </div>
          </div>
          <DialogFooter className="self-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
