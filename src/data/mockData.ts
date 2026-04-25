export type Urgency = 'Low' | 'Standard' | 'High' | 'Urgent';
export type TaskStatus = 'Open' | 'Complete';
export type RoomStatus = 'Dirty' | 'In Progress' | 'Clean' | 'DND';
export type TaskType = 'Request' | 'Maintenance' | 'Complaint';
export type TaskSource = 'Guest call' | 'Front desk' | 'Quick add';
export type RoomType = 'King' | 'Queen' | 'Suite' | 'Double';
export type PriorityFlag = 'VIP' | 'Early arrival' | 'Late checkout';

export interface Task {
  id: string;
  room: string;
  type: TaskType;
  category: string;
  description: string;
  urgency: Urgency;
  status: TaskStatus;
  source: TaskSource;
  createdAt: Date;
}

export interface Room {
  number: string;
  type: RoomType;
  status: RoomStatus;
  checkoutTime?: string;
  priorityFlag?: PriorityFlag;
  cleanedAt?: number;
}

export const initialRooms: Room[] = [
  { number: '214', type: 'King', status: 'Dirty', checkoutTime: '11:00 AM' },
  { number: '108', type: 'Queen', status: 'Dirty', checkoutTime: '10:30 AM' },
  { number: '302', type: 'Suite', status: 'Dirty', priorityFlag: 'VIP' },
  { number: '412', type: 'Queen', status: 'Dirty', checkoutTime: '11:00 AM' },
  { number: '501', type: 'Suite', status: 'Dirty', checkoutTime: '2:00 PM', priorityFlag: 'Late checkout' },
  { number: '225', type: 'King', status: 'Dirty' },
  { number: '118', type: 'Queen', status: 'In Progress' },
  { number: '403', type: 'Double', status: 'Dirty' },
  { number: '305', type: 'King', status: 'Clean', checkoutTime: '2:00 PM', priorityFlag: 'Early arrival' },
  { number: '206', type: 'Double', status: 'Clean' },
  { number: '510', type: 'King', status: 'Clean' },
  { number: '411', type: 'King', status: 'Clean' },
  { number: '207', type: 'Queen', status: 'Clean' },
  { number: '317', type: 'Queen', status: 'DND' },
  { number: '115', type: 'Double', status: 'Dirty', checkoutTime: '10:00 AM' },
];

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    room: '412',
    type: 'Complaint',
    category: 'Noise',
    description: 'Neighbor in 414 is loud',
    urgency: 'Urgent',
    status: 'Open',
    source: 'Front desk',
    createdAt: new Date(Date.now() - 3 * 60_000),
  },
  {
    id: 'task-2',
    room: '302',
    type: 'Request',
    category: 'Pillows/Bedding',
    description: 'Guest requested 2 extra pillows',
    urgency: 'High',
    status: 'Open',
    source: 'Guest call',
    createdAt: new Date(Date.now() - 8 * 60_000),
  },
];
