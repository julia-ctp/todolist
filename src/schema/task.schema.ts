import z from "zod";

export const taskFormSchema = z.object({
  taskName: z.string().min(1, { message: "Please enter your task" }),
  priority: z.enum(["low", "medium", "high", "none"]),
});

export const taskTableSchema = z.object({
  id: z.string() ,
  taskName: z.string().min(1),
  priority: z.enum(["low", "medium", "high", "none"]),
  completed: z.boolean().default(false),
});

export type TaskFormProps = z.infer<typeof taskFormSchema>;
export type TaskTableProps = z.infer<typeof taskTableSchema>;
