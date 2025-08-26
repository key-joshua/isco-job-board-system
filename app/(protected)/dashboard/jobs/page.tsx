"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Eye, Plus, Search, Trash2, X } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { timeAgo } from "@/libs/utils/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Meetings } from "@/components/meetings"
import MessageAlert from "@/components/messageAlert"
import { APIsRequest } from "@/libs/requestAPIs/requestAPIs"
import { JobManagementModal } from "@/components/job-management-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  type: string
  status: string
  description: string
  requirements: string
  benefits: string
  contact_email: string
  contact_phone: string
  date_posted: string
  deadline: string
  is_active: boolean
  is_remote: boolean
  is_urgent: boolean
  available_positions: number
  created_at: string
  updated_at: string
}

export default function Job() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [positionFilter, setPositionFilter] = useState("Available Position")
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view")
  const [alertDetails, setAlertDetails] = useState<{ status: '' | 'error' | 'success'; message: string; id: any }>({ status: '', message: '', id: 0 })
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; jobId: string; jobTitle: string }>({ isOpen: false, jobId: "", jobTitle: "", })

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await APIsRequest.getJobsRequest()
      const data = await response.json()

      if (!response.ok) {
        setAlertDetails({ status: 'error', message: data.error || 'Error', id: Date.now() });
        return;
      }

      setJobs(data.data || [])
    } catch (error: any) {
      setAlertDetails({ status: 'error', message: error?.message || error?.error || 'An error occurred', id: Date.now() });
      console.error("Failed to load jobs:", error)
    } finally {
      setTimeout(() => { setLoading(false); setAlertDetails({ status: '', message: '', id: '' }); }, 3000);
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All Status" || job.status === statusFilter
    let matchesPosition = true
    if (positionFilter === "1") {
      matchesPosition = job.available_positions === 1
    } else if (positionFilter === "2+") {
      matchesPosition = job.available_positions >= 2
    }
    return matchesSearch && matchesStatus && matchesPosition
  })

  const handleViewJob = async (job: Job) => {
    setSelectedJob(job)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleCreateJob = async () => {
    setSelectedJob(null)
    setModalMode("create")
    setIsModalOpen(true)
  }

  const handleSaveJob = async () => {
    await loadJobs()
  }
  
  const handleDeleteJob = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId)
    if (job) setDeleteConfirmation({ isOpen: true, jobId: jobId, jobTitle: job.title, })
  }

  const confirmDelete = async () => {
    try {
      const response = await APIsRequest.deleteJobRequest(deleteConfirmation.jobId)
      const data = await response.json()

      if (!response.ok) {
        setAlertDetails({ status: 'error', message: data.error || 'Error', id: Date.now() });
        return;
      }

      setAlertDetails({ status: 'success', message: data.message || 'Error', id: Date.now() });
      await loadJobs()
    } catch (error: any) {
      setAlertDetails({ status: 'error', message: error?.message || error?.error || 'An error occurred', id: Date.now() });
      console.error("Failed to delete job:", error)
    } finally {
      setTimeout(() => { setAlertDetails({ status: '', message: '', id: '' }); }, 1000);
      setDeleteConfirmation({ isOpen: false, jobId: "", jobTitle: "" })
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, jobId: "", jobTitle: "" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "#4B93E7"
      case "CLOSED":
        return "#ef4444"
      default:
        return "#F7AC25"
    }
  }

  return (
    <>
      <Sidebar />
      <Navbar />
      <div className="min-h-screen bg-[#e5edf9] animate-fade-up animation-fill-forwards">
        <main className="ml-20 pt-16 px-4 py-4 mx-auto -active-mini-active">
          <div className="flex flex-col xl:flex-row gap-6 mt-6">
            <div className="mt-6 flex-1 min-w-0">
              
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2" style={{ color: "#082777" }}> Jobs Management </h1>
                <p className="text-sm" style={{ color: "#4B93E7" }}> View and manage all jobs in the system </p>
              </div>

              {alertDetails.status && ( <MessageAlert status={alertDetails.status} message={alertDetails.message} id={alertDetails.id} /> )}

              <div className="bg-white-active rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-semibold mb-1" style={{ color: "#082777" }}> Jobs Management </h2>
                    <p className="text-sm text-gray-600">View and manage jobs and status</p>
                  </div>
                  <Button onClick={handleCreateJob}  className="bg-primary-semi-active hover:bg-primary-mini-active text-white-active"> <span className="w-6 h-6 rounded-full flex items-center justify-center text-center border border-white-active"> <Plus className="h-4 w-4" /> </span> Create New Job </Button>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Status">All Status</SelectItem>
                        <SelectItem value="OPEN">OPEN</SelectItem>
                        <SelectItem value="CLOSED">CLOSED</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={positionFilter} onValueChange={setPositionFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available Position">Available Position</SelectItem>
                        <SelectItem value="1">1 Position</SelectItem>
                        <SelectItem value="2+">2+ Positions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-600">Positions</th>
                        <th className="text-left p-4 font-medium text-gray-600">Available Positions</th>
                        <th className="text-left p-4 font-medium text-gray-600">Status</th>
                        <th className="text-left p-4 font-medium text-gray-600">Created At</th>
                        <th className="text-left p-4 font-medium text-gray-600">Updated At</th>
                        <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((job) => (
                        <motion.tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white-active bg-white-active text-sm font-medium" style={{ backgroundColor: "#4B93E7" }} > {job.title.charAt(0)} </div>
                              <div>
                                <div className="font-medium" style={{ color: "#082777" }}> {job.title} </div>
                                <div className="text-sm text-gray-500">{timeAgo(job.updated_at)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-medium" style={{ color: "#082777" }}> {job.available_positions} </span>
                          </td>
                          <td className="p-4">
                            <Badge className="text-white-active" style={{ backgroundColor: getStatusColor(job.status) }}> {job.status} </Badge>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-600">{new Date(job.created_at).toLocaleString()}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-600">{new Date(job.updated_at).toLocaleString()}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewJob(job)} className="text-gray-600 hover:text-gray-900" > View <Eye className="h-4 w-4 ml-1" /> </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteJob(job.id)} className="text-red-600 hover:text-red-900 hover:bg-red-50" > Delete <Trash2 className="h-4 w-4 ml-1" /> </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredJobs.length === 0 && loading === false && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4"> {positionFilter === "2+" ? "No jobs found with 2+ available positions" : positionFilter === "1" ? "No jobs found with exactly 1 position" : "No jobs found matching your criteria"} </p>
                    <Button onClick={handleCreateJob} style={{ backgroundColor: "#4B93E7" }} className="text-white-active bg-white-active"> <Plus className="h-4 w-4 mr-2" /> Create New Job </Button>
                  </div>
                )}
              </div>

              {deleteConfirmation.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white-active rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold" style={{ color: "#082777" }}> Confirm Delete </h3>
                      <Button variant="ghost" size="sm" onClick={cancelDelete}> <X className="h-4 w-4" /> </Button>
                    </div>
                    <p className="text-gray-600 mb-6"> Are you sure you want to delete the job &ldquo;{deleteConfirmation.jobTitle}&quot;? This action cannot be undone. </p>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={cancelDelete}> Cancel </Button>
                      <Button onClick={confirmDelete} className="bg-red-600 text-white-active"> <Trash2 className="h-4 w-4 mr-2" /> Delete Job </Button>
                    </div>
                  </div>
                </div>
              )}

              <JobManagementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} job={selectedJob} mode={modalMode} onSave={handleSaveJob} />
            </div>

            <div className="w-full xl:w-96 xl:flex-shrink-0">
              <Meetings />
            </div>
        </div>
      </main>
    </div>      
  </>
  )
}