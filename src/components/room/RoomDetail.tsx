import { useState } from 'react';
import { ArrowLeft, Check, Moon, AlertTriangle } from 'lucide-react';
import type { Room, RoomStatus } from '@/data/mockData';
import { ReportIssueSheet } from '@/components/report/ReportIssueSheet';

const statusLabel: Record<RoomStatus, string> = {
  Dirty: 'Start Cleaning',
  'In Progress': 'Mark Clean',
  Clean: 'Clean',
  DND: 'Set to Dirty',
};

const statusButtonStyle: Record<RoomStatus, string> = {
  Dirty: 'bg-[#10b981] text-white hover:bg-[#0d9668] active:bg-[#0a7d56]',
  'In Progress': 'bg-[#10b981] text-white hover:bg-[#0d9668] active:bg-[#0a7d56]',
  Clean: 'bg-[#242938] text-[#64748b] cursor-default',
  DND: 'bg-[#7c3aed]/20 text-[#a78bfa] hover:bg-[#7c3aed]/30',
};

interface RoomDetailProps {
  room: Room;
  onBack: () => void;
  onSetStatus: (roomNumber: string, status: RoomStatus) => void;
}

export function RoomDetail({ room, onBack, onSetStatus }: RoomDetailProps) {
  const [reportOpen, setReportOpen] = useState(false);

  const nextStatus: RoomStatus | null =
    room.status === 'Dirty' ? 'In Progress' :
    room.status === 'In Progress' ? 'Clean' :
    room.status === 'DND' ? 'Dirty' :
    null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-[#242938]">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#242938] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <span className="text-[#f8fafc] text-lg font-semibold">Room {room.number}</span>
          <span className="text-[#64748b] text-[13px]">{room.type}</span>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
        {/* Room info card */}
        <div className="rounded-xl bg-[#141824] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[#64748b] text-[13px]">Status</span>
            <span className={`flex items-center gap-1.5 text-[14px] font-medium ${
              room.status === 'Dirty' ? 'text-[#94a3b8]' :
              room.status === 'In Progress' ? 'text-[#f59e0b]' :
              room.status === 'Clean' ? 'text-[#10b981]' :
              'text-[#a78bfa]'
            }`}>
              {room.status === 'Clean' && <Check className="w-4 h-4" />}
              {room.status === 'DND' && <Moon className="w-4 h-4" />}
              {room.status}
            </span>
          </div>
          {room.checkoutTime && (
            <div className="flex items-center justify-between">
              <span className="text-[#64748b] text-[13px]">Checkout</span>
              <span className="text-[#f8fafc] text-[14px]">{room.checkoutTime}</span>
            </div>
          )}
          {room.priorityFlag && (
            <div className="flex items-center justify-between">
              <span className="text-[#64748b] text-[13px]">Priority</span>
              <span className={`text-[14px] font-medium ${
                room.priorityFlag === 'VIP' ? 'text-[#f59e0b]' : 'text-[#94a3b8]'
              }`}>
                {room.priorityFlag}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          {/* Primary status action */}
          <button
            disabled={room.status === 'Clean'}
            onClick={() => {
              if (nextStatus) {
                onSetStatus(room.number, nextStatus);
                onBack();
              }
            }}
            className={`w-full h-12 rounded-xl font-medium text-[15px] transition-colors ${statusButtonStyle[room.status]}`}
          >
            {statusLabel[room.status]}
          </button>

          {/* Report issue (secondary) */}
          <button
            onClick={() => setReportOpen(true)}
            className="w-full h-11 rounded-xl font-medium text-[14px] border border-[#242938] text-[#94a3b8] bg-transparent hover:bg-[#1a1f2e] hover:text-[#f8fafc] active:bg-[#242938] transition-colors flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Report issue
          </button>

          {/* Mark DND */}
          {room.status !== 'DND' && (
            <button
              onClick={() => onSetStatus(room.number, 'DND')}
              className="w-full h-11 rounded-xl font-medium text-[14px] border border-[#7c3aed]/30 text-[#a78bfa] bg-transparent hover:bg-[#7c3aed]/10 active:bg-[#7c3aed]/20 transition-colors flex items-center justify-center gap-2"
            >
              <Moon className="w-4 h-4" />
              Mark DND
            </button>
          )}
        </div>
      </div>

      <ReportIssueSheet
        roomNumber={room.number}
        open={reportOpen}
        onOpenChange={setReportOpen}
      />
    </div>
  );
}
