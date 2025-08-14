"use client"

import Image from "next/image"

const overviewData = [
  {
    number: 33,
    color: "bg-blue-50",
    headOne: "Interview",
    headTwo: "Scheduled",
    image: "/interview-scheduled.svg"
  },
  {
    number: 2,
    color: "bg-blue-50",
    headOne: "Interview Feedback",
    headTwo: "Pending",
    image: "/interview-feedback-pending.svg"
  },
  {
    number: 44,
    color: "bg-blue-50",
    headOne: "Approval",
    headTwo: "Pending",
    image: "/approval-pending.svg"
  },
  {
    number: 13,
    color: "bg-blue-50",
    headOne: "Offer Acceptance",
    headTwo: "Pending",
    image: "/offer-acceptance-pending.svg"
  },
  {
    number: 17,
    color: "bg-blue-50",
    headOne: "Documentations",
    headTwo: "Pending",
    image: "/documentations-pending.svg"
  },
  {
    number: 3,
    color: "bg-blue-50",
    headOne: "Training",
    headTwo: "Pending",
    image: "/training-pending.svg"
  },
  {
    number: 5,
    color: "bg-blue-50",
    headOne: "Supervisor Allocation",
    headTwo: "Pending",
    image: "/supervisor-allocation-pending.svg"
  },
  {
    number: 56,
    color: "bg-blue-50",
    headOne: "Project Allocation",
    headTwo: "Pending",
    image: "/project-allocation-pending.svg"
  },
]

export const Overview: React.FC = () => {

  return (
    <div className="p-6 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-primary-active">Overview</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {overviewData.map((item, index) => (
          <div key={index} className="relative w-full bg-[#f3f8ff] rounded-xl p-4 flex items-center justify-between shadow-sm opacity-0 translate-y-4 animate-fade-up animation-fill-forwards" style={{ animationDelay: `${index * 100}ms`, animationDuration: "500ms" }} >
            <div className="w-20 h-16 -top-6 -left-6 absolute text-lg font-extrabold rounded-3xl shadow flex items-center justify-center text-center text-primary-active border border-primary-active bg-[#f3f8ff]"> {item.number} </div>

            <div className="mt-24 space-y-1">
              <h3 className="text-base font-medium text-gray-600">{item.headOne}</h3>
              <h3 className="text-base font-medium text-gray-600">{item.headTwo}</h3>
            </div>

            <div className="absolute right-4 top-6 rounded-md">
              <div className="relative w-32 h-24 rounded-md overflow-hidden">
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-2 rounded-full" />
                <Image src={item.image || "/placeholder.svg"} alt="Interview Illustration" fill className="object-contain" priority />

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-8 h-4 bg-gray-300 rounded-sm border border-gray-400">
                  <div className="w-full h-2 bg-blue-200 rounded-t-sm" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
