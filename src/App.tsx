import { useState } from 'react';
import { Home, MessageCircle } from 'lucide-react';
import { LanceLogo } from '@/components/ui/LanceLogo';
import { useAppState } from '@/hooks/useAppState';
import { RoomList } from '@/components/home/RoomList';
import { TaskList } from '@/components/home/TaskList';
import { RoomDetail } from '@/components/room/RoomDetail';

function App() {
  const { state, dispatch } = useAppState();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const room = selectedRoom
    ? state.rooms.find((r) => r.number === selectedRoom)
    : null;

  if (room) {
    return (
      <div className="min-h-dvh bg-[#0a0e1a] text-[#f8fafc] flex flex-col max-w-md mx-auto">
        <RoomDetail
          room={room}
          onBack={() => setSelectedRoom(null)}
          onSetStatus={(roomNumber, status) => {
            dispatch({ type: 'SET_STATUS', roomNumber, status });
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#0a0e1a] text-[#f8fafc] flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[#242938]">
        <LanceLogo className="text-[#10b981]" />
        <div className="w-8 h-8 rounded-full bg-[#242938] flex items-center justify-center text-[13px] font-semibold text-[#94a3b8]">
          MG
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-8">
        <TaskList
          tasks={state.tasks}
          onTaskTap={(taskId) => {
            console.log('Navigate to task', taskId);
          }}
          onTaskComplete={(taskId) =>
            dispatch({ type: 'COMPLETE_TASK', taskId })
          }
          onTaskReopen={(taskId) =>
            dispatch({ type: 'REOPEN_TASK', taskId })
          }
        />

        <RoomList
          rooms={state.rooms}
          onSetStatus={(roomNumber, status) =>
            dispatch({ type: 'SET_STATUS', roomNumber, status })
          }
          onRowTap={(roomNumber) => setSelectedRoom(roomNumber)}
        />
      </main>

      {/* Bottom nav */}
      <nav className="flex border-t border-[#242938] bg-[#0a0e1a]">
        <button className="flex-1 flex flex-col items-center gap-1 py-3 text-[#64748b]">
          <MessageCircle className="w-5 h-5" />
          <span className="text-[11px]">Chat</span>
        </button>
        <button className="flex-1 flex flex-col items-center gap-1 py-3 text-[#10b981]">
          <Home className="w-5 h-5" />
          <span className="text-[11px] font-medium">Home</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
