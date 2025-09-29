'use client'
import { Separator } from '@/components/ui/separator'
import {
  event_min,
  hour_height,
  time_labels,
  total_height,
  event_position,
  partition_events,
} from '../until/helpers'
import { sample } from '../until/mock-data'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useRef } from 'react'

export const DailyCalendar = () => {
  const eventContainerRef = useRef<HTMLDivElement>(null)
  const partitioed_events = partition_events(sample)

  const handleGridClick = (e: React.MouseEvent) => {
    const element = eventContainerRef.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    const y = e.clientY - rect.top // y position within the element
    const yWithScroll = y + element.scrollTop
  }
  return (
    <div className="grid grid-cols-12 p-4 w-full" style={{ height: total_height }}>
      <div
        className="col-start-2 col-span-10 row-start-1 relative w-full"
        style={{ height: total_height }}
      >
        {time_labels.map((label, i) => {
          return (
            <Popover key={i}>
              <PopoverTrigger
                className="flex items-start w-full col-span-10 hover:cursor-pointer relative "
                style={{ height: hour_height }}
                onClick={() => {
                  console.log('click', label)
                }}
              >
                <div className="pr-2 text-sm opacity-60 whitespace-nowrap">{label}</div>
                <Separator orientation="horizontal" className="bg-red-300 w-full absolute" />
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-2">Add event at {label}</div>
              </PopoverContent>
            </Popover>
          )
        })}
      </div>

      <div
        className="col-start-3 col-span-9 row-start-1 relative z-30"
        style={{ height: total_height }}
        ref={eventContainerRef}
        onClick={}
      >
        {partitioed_events.map((event, i) => {
          const { top, height } = event_position(event)
          const widthPercent = 100 / event.totalCols
          const leftPercent = event.col_index * widthPercent
          return (
            <Button
              key={event.id}
              className="absolute w-auto bg-sky-600 text-white rounded-lg p-2 shadow-md items-start flex flex-col"
              style={{
                top,
                height,
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
              }}
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-sm opacity-80">
                {event.start} - {event.end}
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
