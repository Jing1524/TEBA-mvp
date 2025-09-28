import { event_min, hour_height, time_labels, total_height, event_position } from './until/helpers'
import { sample } from './until/mock-data'

export const DailyCalendar = () => {
  return (
    <div className="grid grid-cols-12 p-4 w-full " style={{ height: total_height }}>
      <div className="col-span-2">
        {time_labels.map((label, i) => {
          return (
            <div
              key={i}
              className="text-right pr-2 text-sm opacity-60"
              style={{ height: hour_height }}
            >
              {label}
            </div>
          )
        })}
      </div>

      <div className="col-span-8 col-start-4 relative" style={{ height: total_height }}>
        {sample.map((event, i) => {
          const { top, height } = event_position(event)
          // while (i > 0) {
          // const prev_event = event_position(sample[i-1])
          // if (prev_event.end > top ){
          //     console.log('overlapping', { event, prev_event })
          // }}
          return (
            <div
              key={event.id}
              className="absolute w-auto bg-blue-500 text-white rounded-lg p-2 shadow-md"
              style={{ top, height }}
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-sm opacity-80">
                {event.start} - {event.end}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
