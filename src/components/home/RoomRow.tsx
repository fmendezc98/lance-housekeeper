import { useState, useRef, useEffect } from 'react';
import { Check, Moon, Zap } from 'lucide-react';
import type { Room, RoomStatus } from '@/data/mockData';

const pillStyles: Record<RoomStatus, string> = {
  Dirty: 'bg-[#64748b]/20 text-[#94a3b8] border border-[#64748b]/40',
  'In Progress': 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/50',
  Clean: 'bg-[#10b981] text-white',
  DND: 'bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/50',
};

const pillLabel: Record<RoomStatus, string> = {
  Dirty: 'Dirty',
  'In Progress': 'In Progress',
  Clean: 'Clean',
  DND: 'DND',
};

const allStatuses: RoomStatus[] = ['Dirty', 'In Progress', 'Clean', 'DND'];

const menuDotStyles: Record<RoomStatus, string> = {
  Dirty: 'bg-[#64748b]',
  'In Progress': 'bg-[#f59e0b]',
  Clean: 'bg-[#10b981]',
  DND: 'bg-[#7c3aed]',
};

interface RoomRowProps {
  room: Room;
  isNextUp?: boolean;
  onSetStatus: (roomNumber: string, status: RoomStatus) => void;
  onRowTap: (roomNumber: string) => void;
}

export function RoomRow({ room, isNextUp, onSetStatus, onRowTap }: RoomRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const isClean = room.status === 'Clean';

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors min-h-[56px] ${
        isNextUp
          ? 'bg-[#10b981]/10 border border-[#10b981]/30 hover:bg-[#10b981]/15 active:bg-[#10b981]/15'
          : 'bg-[#141824] hover:bg-[#1a1f2e] active:bg-[#1a1f2e]'
      }`}
      onClick={() => onRowTap(room.number)}
    >
      {/* Left: room info */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[#f8fafc] text-[15px] font-medium flex items-center gap-1.5">
          {isNextUp && <Zap className="w-3.5 h-3.5 text-[#10b981] shrink-0" />}
          {room.number} · {room.type}
        </span>
        {(room.checkoutTime || room.priorityFlag) && (
          <span className="text-[#64748b] text-[13px]">
            {room.priorityFlag === 'VIP' && (
              <>
                <span className="text-[#f59e0b]">VIP</span>
                {room.checkoutTime && ` · ${room.checkoutTime} checkout`}
              </>
            )}
            {room.priorityFlag === 'Late checkout' && `Late checkout ${room.checkoutTime}`}
            {room.priorityFlag === 'Early arrival' && `Early arrival ${room.checkoutTime}`}
            {!room.priorityFlag && room.checkoutTime && `${room.checkoutTime} checkout`}
          </span>
        )}
      </div>

      {/* Right: status pill + popover */}
      <div className="relative shrink-0 ml-3" ref={menuRef}>
        <button
          className={`
            flex items-center justify-center gap-1.5 px-3 h-8 w-[108px] rounded-full text-[13px] font-medium
            transition-all duration-200 select-none
            ${pillStyles[room.status]}
            ${isClean ? 'opacity-70' : ''}
          `}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
        >
          {room.status === 'Clean' && <Check className="w-3.5 h-3.5" />}
          {room.status === 'DND' && <Moon className="w-3.5 h-3.5" />}
          {pillLabel[room.status]}
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 z-50 bg-[#1a1f2e] border border-[#242938] rounded-xl py-1 shadow-lg min-w-[150px]">
            {allStatuses.map((status) => (
              <button
                key={status}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-left transition-colors
                  ${status === room.status ? 'text-[#f8fafc] bg-[#242938]' : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#242938]/60'}
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  if (status !== room.status) {
                    onSetStatus(room.number, status);
                  }
                  setMenuOpen(false);
                }}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${menuDotStyles[status]}`} />
                {status === 'DND' && <Moon className="w-3.5 h-3.5 -ml-0.5" />}
                {status === 'Clean' && <Check className="w-3.5 h-3.5 -ml-0.5" />}
                {pillLabel[status]}
                {status === room.status && (
                  <Check className="w-3.5 h-3.5 ml-auto text-[#10b981]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
