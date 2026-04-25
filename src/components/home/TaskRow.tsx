import { Check } from 'lucide-react';
import type { Task, Urgency } from '@/data/mockData';

const urgencyStyles: Record<Urgency, string> = {
  Urgent: 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30',
  High: 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30',
  Standard: 'bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30',
  Low: 'bg-[#64748b]/15 text-[#94a3b8] border border-[#64748b]/30',
};

function timeAgo(date: Date): string {
  const mins = Math.round((Date.now() - date.getTime()) / 60_000);
  if (mins < 1) return 'just now';
  if (mins === 1) return '1m ago';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

interface TaskRowProps {
  task: Task;
  onTap: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export function TaskRow({ task, onTap, onComplete }: TaskRowProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#141824] hover:bg-[#1a1f2e] active:bg-[#1a1f2e] cursor-pointer transition-colors min-h-[56px]"
      onClick={() => onTap(task.id)}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[#f8fafc] text-[15px] font-medium">
          {task.room} · {task.type} · {task.category}
        </span>
        <span className="text-[#64748b] text-[13px]">
          {task.source} · {timeAgo(task.createdAt)}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-3">
        <span
          className={`
            px-2.5 py-0.5 rounded-full text-[12px] font-medium
            ${urgencyStyles[task.urgency]}
          `}
        >
          {task.urgency}
        </span>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center bg-[#10b981]/15 text-[#10b981] hover:bg-[#10b981]/30 active:bg-[#10b981] active:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onComplete(task.id);
          }}
        >
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
