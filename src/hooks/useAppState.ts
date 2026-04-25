import { useReducer } from 'react';
import { initialRooms, initialTasks } from '@/data/mockData';
import type { Room, Task, RoomStatus } from '@/data/mockData';

interface AppState {
  rooms: Room[];
  tasks: Task[];
}

type Action =
  | { type: 'ADVANCE_STATUS'; roomNumber: string }
  | { type: 'SET_STATUS'; roomNumber: string; status: RoomStatus }
  | { type: 'COMPLETE_TASK'; taskId: string }
  | { type: 'REOPEN_TASK'; taskId: string }
  | { type: 'ADD_TASK'; task: Task };

const statusOrder: RoomStatus[] = ['Dirty', 'In Progress', 'Clean'];

function nextStatus(current: RoomStatus): RoomStatus {
  if (current === 'DND') return 'Dirty';
  const idx = statusOrder.indexOf(current);
  if (idx === -1 || idx === statusOrder.length - 1) return current;
  return statusOrder[idx + 1];
}

const sortOrder: Record<RoomStatus, number> = {
  'In Progress': 0,
  'Dirty': 1,
  'Clean': 2,
  'DND': 3,
};

const priorityOrder: Record<string, number> = {
  'VIP': 0,
  'Early arrival': 1,
  'Late checkout': 4,
};

function parseTime(t?: string): number {
  if (!t) return 9999;
  const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 9999;
  let hours = parseInt(match[1]);
  const mins = parseInt(match[2]);
  if (match[3].toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (match[3].toUpperCase() === 'AM' && hours === 12) hours = 0;
  return hours * 60 + mins;
}

function sortRooms(rooms: Room[]): Room[] {
  return [...rooms].sort((a, b) => {
    // 1. Status group
    const statusDiff = sortOrder[a.status] - sortOrder[b.status];
    if (statusDiff !== 0) return statusDiff;

    // Clean rooms: most recently completed first
    if (a.status === 'Clean') {
      return (b.cleanedAt ?? 0) - (a.cleanedAt ?? 0);
    }

    // Dirty rooms: checkout time first, then no-checkout, then Late checkout last
    if (a.status === 'Dirty') {
      const aLate = a.priorityFlag === 'Late checkout';
      const bLate = b.priorityFlag === 'Late checkout';
      if (aLate !== bLate) return aLate ? 1 : -1;

      const aHasTime = !!a.checkoutTime && !aLate;
      const bHasTime = !!b.checkoutTime && !bLate;
      if (aHasTime !== bHasTime) return aHasTime ? -1 : 1;

      if (aHasTime && bHasTime) {
        return parseTime(a.checkoutTime) - parseTime(b.checkoutTime);
      }

      return 0;
    }

    // Other statuses: earliest checkout time, then priority
    const timeDiff = parseTime(a.checkoutTime) - parseTime(b.checkoutTime);
    if (timeDiff !== 0) return timeDiff;

    const aPri = a.priorityFlag ? priorityOrder[a.priorityFlag] : 3;
    const bPri = b.priorityFlag ? priorityOrder[b.priorityFlag] : 3;
    return aPri - bPri;
  });
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADVANCE_STATUS': {
      const rooms = state.rooms.map((r) => {
        if (r.number !== action.roomNumber) return r;
        const next = nextStatus(r.status);
        return {
          ...r,
          status: next,
          cleanedAt: next === 'Clean' ? Date.now() : undefined,
        };
      });
      return { ...state, rooms: sortRooms(rooms) };
    }
    case 'SET_STATUS': {
      const rooms = state.rooms.map((r) =>
        r.number === action.roomNumber
          ? {
              ...r,
              status: action.status,
              cleanedAt: action.status === 'Clean' ? Date.now() : undefined,
            }
          : r
      );
      return { ...state, rooms: sortRooms(rooms) };
    }
    case 'COMPLETE_TASK': {
      const tasks = state.tasks.map((t) =>
        t.id === action.taskId ? { ...t, status: 'Complete' as const } : t
      );
      return { ...state, tasks };
    }
    case 'REOPEN_TASK': {
      const tasks = state.tasks.map((t) =>
        t.id === action.taskId ? { ...t, status: 'Open' as const } : t
      );
      return { ...state, tasks };
    }
    case 'ADD_TASK': {
      return { ...state, tasks: [...state.tasks, action.task] };
    }
    default:
      return state;
  }
}

export function useAppState() {
  const [state, dispatch] = useReducer(reducer, {
    rooms: sortRooms(initialRooms),
    tasks: initialTasks,
  });

  return { state, dispatch };
}
