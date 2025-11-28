"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, Check, Edit, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTask } from "@/context/task.context";
import type { TaskTableProps } from "@/schema/task.schema";
import { TaskEditModal } from "../TaskEditModal";
import { Badge } from "../ui/badge";

export function TaskTable() {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "completed", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [isEditModalOpen, setIsEditModalOpen] = React.useState<boolean>(false);

  const { getAllTasks, tasks, checkTask, deleteTask, getTaskById } = useTask();

  React.useEffect(() => {
    getAllTasks();
  }, [getAllTasks]);

  function toggleCompleted(task: TaskTableProps, state: string | boolean) {
    checkTask(task, state);
  }

  async function handleEdit(id: string) {
    await getTaskById(id);
    setIsEditModalOpen(true);
  }

  const columns: ColumnDef<TaskTableProps>[] = [
    {
      accessorKey: "completed",
      id: "completed",
      header: () => <Check />,
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.original.completed}
            onCheckedChange={(state) => toggleCompleted(row.original, state)}
            aria-label="mark task as completed"
          />
        );
      },
      enableSorting: true,
      sortingFn: (a, b) => {
        return Number(a.original.completed) - Number(b.original.completed);
      },
    },
    {
      accessorKey: "taskName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Task
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const task = row.original;
        return (
          <div className={task.completed ? "line-through opacity-50" : ""}>
            {row.getValue("taskName")}
          </div>
        );
      },
      enableSorting: true,
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2"
        >
          Priority
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const task = row.original;
        const value = row.getValue("priority") as TaskTableProps["priority"];

        const badgeColors = {
          low: "bg-yellow-500/20 text-yellow-700",
          medium: "bg-blue-500/20 text-blue-700",
          high: "bg-purple-500/20 text-purple-700",
          none: "bg-gray-500/20 text-gray-700",
        };

        return (
          <Badge
            className={`${badgeColors[value] ?? ""} ${task.completed ? "opacity-50" : ""}`}
          >
            {value}
          </Badge>
        );
      },
      enableSorting: true,
      sortingFn: (a, b) => {
        if (a.original.completed !== b.original.completed) {
          return Number(a.original.completed) - Number(b.original.completed);
        }
        const order: Record<TaskTableProps["priority"], number> = {
          high: 3,
          medium: 2,
          low: 1,
          none: 0,
        };

        return order[a.original.priority] - order[b.original.priority];
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const task = row.original;

        return (
          <div className={`flex gap-2 ${task.completed ? "opacity-50" : ""}`}>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => handleEdit(task.id)}
              aria-label="Edit"
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => deleteTask(task.id)}
              aria-label="Delete"
              className="cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: tasks,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-5xl mt-8">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter tasks..."
          value={
            (table.getColumn("taskName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("taskName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <TaskEditModal isOpen={isEditModalOpen} setIsOpen={setIsEditModalOpen} />
    </div>
  );
}
