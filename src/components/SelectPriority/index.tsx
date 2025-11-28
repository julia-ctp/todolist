import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskFormProps } from "@/schema/task.schema";

interface SelectPriorityProps {
  onChange?: (value: TaskFormProps["priority"]) => void;
  value?: TaskFormProps["priority"] 
}

export function SelectPriority({ onChange, value }: SelectPriorityProps) {
  return (
    <Select onValueChange={(v) => onChange?.(v as TaskFormProps["priority"])} value={value !== "none" ? value : ""}>
      <SelectTrigger className="w-full cursor-pointer">
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="high">high</SelectItem>
          <SelectItem value="medium">medium</SelectItem>
          <SelectItem value="low">low</SelectItem>
          <SelectItem value="none">none</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
