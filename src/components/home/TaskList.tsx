import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Task } from '@/data/mockData';
import { TaskRow } from './TaskRow';
import { CompletedTaskRow } from './CompletedTaskRow';

interface TaskListProps {
  tasks: Task[];
  onTaskTap: (taskId: string) => void;
  onTaskComplete: (taskId: string) => void;
  onTaskReopen: (taskId: string) => void;
}

export function TaskList({ tasks, onTaskTap, onTaskComplete, onTaskReopen }: TaskListProps) {
  const openTasks = tasks.filter((t) => t.status === 'Open');
  const completedTasks = tasks.filter((t) => t.status === 'Complete');
  const [showCompleted, setShowCompleted] = useState(false);

  return (
    <section className="flex flex-col gap-3">
      {/* Section header */}
      <div>
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#64748b] mb-1">
          My Tasks
        </p>
        <div className="flex items-baseline justify-between">
          <h2 className="text-[#f8fafc] text-lg font-semibold m-0">My tasks</h2>
          <span className="text-[#64748b] text-sm">{openTasks.length}</span>
        </div>
      </div>

      {/* Task rows */}
      <div className="flex flex-col gap-2">
        {openTasks.length === 0 ? (
          <p className="text-[#64748b] text-sm text-center py-6">No pending tasks</p>
        ) : (
          openTasks.map((task) => (
            <TaskRow key={task.id} task={task} onTap={onTaskTap} onComplete={onTaskComplete} />
          ))
        )}
      </div>

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          <button
            className="flex items-center gap-1.5 text-[#64748b] text-sm hover:text-[#94a3b8] transition-colors self-start"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            Completed ({completedTasks.length})
          </button>
          {showCompleted && (
            <div className="flex flex-col gap-2">
              {completedTasks.map((task) => (
                <CompletedTaskRow key={task.id} task={task} onReopen={onTaskReopen} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
