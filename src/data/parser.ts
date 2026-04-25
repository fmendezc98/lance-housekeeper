import type { TaskType, Urgency } from './mockData';

export interface ParsedTask {
  room: string;
  type: TaskType;
  category: string;
  urgency: Urgency;
  description: string;
}

export function parseQuickAdd(input: string, roomContext: string): ParsedTask {
  const text = input.toLowerCase();
  const room = roomContext;

  const categoryMap: Array<[RegExp, { type: TaskType; category: string }]> = [
    [/leak|drip|dripping/, { type: 'Maintenance', category: 'Sink' }],
    [/shower|hot water|no water/, { type: 'Maintenance', category: 'Shower' }],
    [/ac|a\/c|air cond|hvac|heat/, { type: 'Maintenance', category: 'HVAC' }],
    [/light|bulb|lamp/, { type: 'Maintenance', category: 'Electrical' }],
    [/tv|television|remote/, { type: 'Maintenance', category: 'TV' }],
    [/door|lock|key/, { type: 'Maintenance', category: 'Door/Lock' }],
    [/broken|not working|won't/, { type: 'Maintenance', category: 'Other' }],
    [/loud|noise|noisy|music/, { type: 'Complaint', category: 'Noise' }],
    [/smoke|smell/, { type: 'Complaint', category: 'Smell' }],
    [/towel/, { type: 'Request', category: 'Towels' }],
    [/pillow|blanket|sheet|linen|bedding/, { type: 'Request', category: 'Pillows/Bedding' }],
    [/coffee|tea|creamer/, { type: 'Request', category: 'Coffee/Tea' }],
    [/iron|ironing/, { type: 'Request', category: 'Iron/Ironing Board' }],
    [/toilet|tp|toilet paper/, { type: 'Request', category: 'Toilet' }],
    [/soap|shampoo|toiletries|conditioner/, { type: 'Request', category: 'Toiletries' }],
  ];

  let type: TaskType = 'Request';
  let category = 'Other';
  for (const [pattern, mapping] of categoryMap) {
    if (pattern.test(text)) {
      type = mapping.type;
      category = mapping.category;
      break;
    }
  }

  let urgency: Urgency = 'Standard';
  if (/urgent|asap|immediately|now|emergency/.test(text)) urgency = 'Urgent';
  else if (/priority|important|soon/.test(text)) urgency = 'High';
  else if (/whenever|eventually|low|no rush|when you can/.test(text)) urgency = 'Low';

  return { room, type, category, urgency, description: input };
}
