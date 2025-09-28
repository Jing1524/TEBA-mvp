export type CalEvent = { id: string; title: string; start: string; end: string } // "HH:MM" 24h
export const sample: CalEvent[] = [
  { id: '1', title: 'Standup', start: '09:30', end: '10:00' },
  { id: '2', title: '1:1', start: '09:45', end: '10:30' },
  { id: '3', title: 'Design Review', start: '11:00', end: '12:00' },
]
