import { CalEvent } from './mock-data'

export const day_start_min = 6 * 60
export const day_end_min = 22 * 60
export const hour_height = 120 // 2px per minute
export const snap = 15 // snap to 15 min increments
export const total_height = (day_end_min - day_start_min) * 2

export const time_labels = Array.from({ length: (day_end_min - day_start_min) / 60 + 1 }).map(
  (_, i) => {
    const hour = Math.floor((day_start_min + i * 60) / 60)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 === 0 ? 12 : hour % 12
    return `${hour12}:00 ${ampm}`
  }
)

// event helper
export const event_min = (time: string) => {
  const [hour, min] = time.split(':').map(Number)
  return hour * 60 + min
}

export const event_position = (eventData: CalEvent) => {
  const event_start = event_min(eventData.start)
  const event_end = event_min(eventData.end)
  const event_top_pos = (event_start - day_start_min) * 2
  const event_height = (event_end - event_start) * 2
  const event_end_pos = event_top_pos + event_height
  return { top: event_top_pos, end: event_end_pos, height: event_height }
}

export const is_Over_lapping = (eventData: CalEvent) => {
  const event_start = event_min(eventData.start)
  const event_end = event_min(eventData.end)
  return event_start >= event_end
}

// partition events into different columns to handle overlapping events
type partitioed = CalEvent & { col_index: number; totalCols: number }
export const partition_events = (Events: CalEvent[]) => {
  const columns: { endTime: string }[] = []
  const partitioned: partitioed[] = []

  const sortedEvents = Events.sort((a, b) => event_min(a.start) - event_min(b.start))

  for (const event of sortedEvents) {
    let col_index = -1
    for (let i = 0; i < columns.length; i++) {
      if (event_min(columns[i].endTime) <= event_min(event.start)) {
        col_index = i
        break
      }
    }
    if (col_index === -1) {
      col_index = columns.length
      columns.push({ endTime: event.end })
    } else {
      columns[col_index].endTime = event.end
    }
    partitioned.push({ ...event, col_index, totalCols: 0 })
  }
  const totalCols = Math.max(1, columns.length)
  return partitioned.map((event) => ({ ...event, totalCols }))
}
