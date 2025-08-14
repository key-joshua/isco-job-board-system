"use client"

import { useState } from "react";
import { timeAgo } from "@/libs/utils/utils"
import { Badge } from "@/components/ui/badge"

interface RequireAttentionProps { jobs: any[] | []; applicants: any[] | [] }
export const RequireAttention: React.FC<RequireAttentionProps> = ({ jobs, applicants }) => {
  const [activeTab, setActiveTab] = useState("jobs")

  const getCurrentData = () => {
    switch (activeTab) {
      case "applicants":
        return applicants
      default:
        return jobs
    }
  }

  const tabs = [
    { id: "jobs", label: "Jobs" },
    { id: "applicants", label: "Applicants" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "#4B93E7"
      case "CLOSED":
        return "#ef4444"
      case "APPROVED":
        return "#4B93E7"
      case "REJECTED":
        return "#ef4444"
      case "PENDING":
        return "#F7AC25"
      default:
        return "bg-[#082777]"
    }
  }

  return (
    <div className="p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-primary-active mb-6">Require Attention</h2>

      <div className="flex space-x-8 mb-6">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`pb-2 text-sm font-medium transition-colors relative ${activeTab === tab.id ? "text-gray-900 border-b-2 border-yellow-400" : "text-gray-500 hover:text-gray-700"}`} > {tab.label} </button>
        ))}
      </div>

      <div className="pt-4 overflow-x-auto bg-[#f3f8ff]">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">{`${activeTab === 'jobs' ? "Positions" : "Applicants"}`}</th>
              <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">{`${activeTab === 'jobs' ? "Available Positions" : "Applied Position"}`}</th>
              <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">Status</th>
              <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">Created At</th>
              <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentData() && getCurrentData().slice(0, 4).map((item, index) => (
              <tr key={index} className="cursor-pointer border-b border-[#e5edf9] hover:bg-primary-micro-active animate-fade-up animation-fill-forwards" style={{ animationDelay: `${index * 100}ms`, animationDuration: "500ms" }}>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img src={`${activeTab === 'applicants' ? `${item.Users?.profile_picture || "/user-avatar.png?height=40&width=40"}` : "/job-position-avatar.svg?height=40&width=40"}`} alt="Avatar" width={40} height={40} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <div className="font-medium text-gray-900 max-w-[150px] truncate">{`${activeTab === 'jobs' ? item.title : item.full_name}`}</div>
                      <div className="text-sm text-gray-500">{timeAgo(item.created_at)}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center font-medium text-gray-900">{`${activeTab === 'jobs' ? item.available_positions : item.Jobs?.title}`}</td>
                <td className="py-4 px-4 text-center font-medium text-gray-900"><Badge className="text-white-active" style={{ backgroundColor: getStatusColor(item.status) }}> {item.status} </Badge></td>
                <td className="py-4 px-4 text-center font-medium text-gray-900">{item.created_at}</td>
                <td className="py-4 px-4 text-center font-medium text-gray-900">{item.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
