import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

const meetingsData = {
  today: [
    {
      time: "3:15",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-blue-100",
      highlightColor: "bg-blue-500",
    },
    {
      time: "10:00",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-blue-100",
      highlightColor: "bg-blue-500",
    },
    {
      time: "10:00",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-blue-100",
      highlightColor: "bg-blue-500",
    },
    {
      time: "10:00",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-green-100",
      highlightColor: "bg-green-500",
    },
  ],
  tomorrow: [
    {
      time: "3:15",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-blue-100",
      highlightColor: "bg-blue-500",
    },
    {
      time: "10:00",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-blue-100",
      highlightColor: "bg-blue-500",
    },
    {
      time: "10:00",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-blue-100",
      highlightColor: "bg-blue-500",
    },
    {
      time: "10:00",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-green-100",
      highlightColor: "bg-green-500",
    },
  ],
  thisWeek: [
    {
      time: "Sep 3",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-blue-100",
      highlightColor: "bg-blue-500",
    },
    {
      time: "Sep 3",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-blue-100",
      highlightColor: "bg-blue-500",
    },
    {
      time: "Sep 3",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-green-100",
      highlightColor: "bg-green-500",
    },
    {
      time: "Sep 3",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-blue-100",
      highlightColor: "bg-blue-500",
    },
    {
      time: "Sep 6",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-green-100",
      highlightColor: "bg-green-500",
    },
    {
      time: "Sep 7",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-blue-100",
      highlightColor: "bg-blue-500",
    },
    {
      time: "Sep 8",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-blue-100",
      highlightColor: "bg-blue-500",
    },
    {
      time: "Sep 8",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-green-100",
      highlightColor: "bg-green-500",
    },
    {
      time: "Sep 8",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-blue-100",
      highlightColor: "bg-blue-500",
    },
    {
      time: "Sep 8",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-blue-100",
      highlightColor: "bg-blue-500",
    },
    {
      time: "Sep 7",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-green-100",
      highlightColor: "bg-green-500",
    },
    {
      time: "Sep 8",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-blue-100",
      highlightColor: "bg-blue-500",
    },
    {
      time: "Sep 5",
      name: "Mini Soman",
      subject: "Mean stack developer",
      phase: "4th phase interview",
      duration: "3:15 - 3:45",
      color: "bg-green-100",
      highlightColor: "bg-green-500",
    },
  ],
}

export function Meetings() {
  return (
    <div className="p-6 h-fit rounded-lg shadow-sm bg-[#f3f8ff]">
      <div className="flex items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h3>
        <Button size="sm" className="h-8 w-8 p-0 ml-2">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-center text-primary-semi-active bg-white-active border border-primary-semi-active"> <Plus className="h-4 w-4" /> </span>
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Today</h4>
          <div className="space-y-2">
            {meetingsData.today.map((meeting, index) => (
              <div key={index} className={`${meeting.color} rounded-lg p-3 flex items-center text-[10px] relative animate-fade-up animation-fill-forwards`} style={{ animationDelay: `${index * 100}ms`, animationDuration: "500ms" }}>
                <span className="text-blue-600 font-medium">{meeting.time}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="flex-1 text-primary-active"> {meeting.name}; {meeting.subject}; {meeting.phase} </span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-600 font-medium">{meeting.duration}</span>
                <div className={`absolute right-0 top-0 bottom-0 w-1 ${meeting.highlightColor} rounded-r-lg`}></div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Tomorrow</h4>
          <div className="space-y-2">
            {meetingsData.tomorrow.map((meeting, index) => (
              <div key={index} className={`${meeting.color} rounded-lg p-3 flex items-center text-[10px] relative animate-fade-up animation-fill-forwards`} style={{ animationDelay: `${index * 100}ms`, animationDuration: "500ms" }}>
                <span className="text-blue-600 font-medium">{meeting.time}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="flex-1 text-primary-active"> {meeting.name}; {meeting.subject}; {meeting.phase} </span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-600 font-medium">{meeting.duration}</span>
                <div className={`absolute right-0 top-0 bottom-0 w-1 ${meeting.highlightColor} rounded-r-lg`}></div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">This Week</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {meetingsData.thisWeek.map((meeting, index) => (
              <div key={index} className={`${meeting.color} rounded-lg p-3 flex items-center text-[10px] relative animate-fade-up animation-fill-forwards`} style={{ animationDelay: `${index * 100}ms`, animationDuration: "500ms" }}>
                <span className="text-blue-600 font-medium">{meeting.time}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="flex-1 text-primary-active"> {meeting.name}; {meeting.subject}; {meeting.phase} </span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-600 font-medium">{meeting.duration}</span>
                <div className={`absolute right-0 top-0 bottom-0 w-1 ${meeting.highlightColor} rounded-r-lg`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
