import type { Room, RoomStatus } from '@/data/mockData';
import { RoomRow } from './RoomRow';

interface RoomListProps {
  rooms: Room[];
  onSetStatus: (roomNumber: string, status: RoomStatus) => void;
  onRowTap: (roomNumber: string) => void;
}

export function RoomList({ rooms, onSetStatus, onRowTap }: RoomListProps) {
  const nonDndRooms = rooms.filter((r) => r.status !== 'DND');
  const cleanCount = rooms.filter((r) => r.status === 'Clean').length;

  // If there's an In Progress room, that's the current one.
  // Otherwise, the first Dirty room is next up.
  const inProgressRoom = rooms.find((r) => r.status === 'In Progress');
  const nextUpRoom = inProgressRoom ?? rooms.find((r) => r.status === 'Dirty');

  return (
    <section className="flex flex-col gap-3">
      {/* Section header */}
      <div>
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#64748b] mb-1">
          Today's Rooms
        </p>
        <div className="flex items-baseline justify-between">
          <h2 className="text-[#f8fafc] text-lg font-semibold m-0">My rooms</h2>
          <span className="text-[#64748b] text-sm">
            {cleanCount} of {nonDndRooms.length} clean
          </span>
        </div>
      </div>

      {/* Room rows */}
      <div className="flex flex-col gap-2">
        {rooms.map((room) => (
          <RoomRow
            key={room.number}
            room={room}
            isNextUp={room.number === nextUpRoom?.number}
            onSetStatus={onSetStatus}
            onRowTap={onRowTap}
          />
        ))}
      </div>
    </section>
  );
}
