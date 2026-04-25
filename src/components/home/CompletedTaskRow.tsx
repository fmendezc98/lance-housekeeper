import { CheckCircle, Undo2 } from 'lucide-react';
import type { Task } from '@/data/mockData';

interface CompletedTaskRowProps {
  task: Task;
  onReopen: (taskId: string) => void;
}

export function CompletedTaskRow({ task, onReopen }: CompletedTaskRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#141824]/60 min-h-[56px] opacity-60">
      <div className="flex items-center gap-3 min-w-0">
        <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[#94a3b8] text-[15px] font-medium opacity-40">
            {task.room} · {task.type} · {task.category}
          </span>
          <span className="text-[#475569] text-[13px]">
            {task.source}
          </span>
        </div>
      </div>
      <button
        className="w-8 h-8 rounded-full flex items-center justify-center bg-[#64748b]/15 text-[#64748b] hover:bg-[#64748b]/30 hover:text-[#94a3b8] active:bg-[#64748b]/40 transition-colors shrink-0 ml-3"
        onClick={() => onReopen(task.id)}
        title="Undo"
      >
        <Undo2 className="w-4 h-4" />
      </button>
    </div>
  );
}
