"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Eye, Search, Trash2, X } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { timeAgo } from "@/libs/utils/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Meetings } from "@/components/meetings"
import MessageAlert from "@/components/messageAlert"
import { APIsRequest } from "@/libs/requestAPIs/requestAPIs"
import { ApplicantManagementModal } from "@/components/applicant-management-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Applicant() {
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [applicants, setApplicants] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null)
  const [alertDetails, setAlertDetails] = useState<{ status: '' | 'error' | 'success'; message: string; id: any }>({ status: '', message: '', id: 0 })
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; applicantId: string; fullName: string }>({ isOpen: false, applicantId: "", fullName: "", })

  useEffect(() => {
    loadApplicants()
  }, [])

  const loadApplicants = async () => {
    setLoading(true);
    try {
      const response = await APIsRequest.getApplicantsRequest()
      const data = await response.json()

      if (!response.ok) {
        setAlertDetails({ status: 'error', message: data.error || 'Error', id: Date.now() });
        return;
      }

      setApplicants(data.data || [])
    } catch (error: any) {
      setAlertDetails({ status: 'error', message: error?.message || error?.error || 'An error occurred', id: Date.now() });
      console.error("Failed to load applicants:", error)
    } finally {
      setTimeout(() => { setLoading(false); setAlertDetails({ status: '', message: '', id: '' }); }, 3000);
    }
  }

  const filteredApplicants = applicants.filter((item) => {
    const matchesSearch = item.Jobs.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All Status" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewApplicant = async (applicant: any) => {
    setSelectedApplicant(applicant)
    setIsModalOpen(true)
  }

  const handleSaveApplicant = async () => {
    await loadApplicants()
  }
  
  const handleDeleteApplicant = (applicantId: string) => {
    const applicant = applicants.find((item) => item.id === applicantId)
    if (applicant) setDeleteConfirmation({ isOpen: true, applicantId: applicantId, fullName: applicant.full_name })
  }

  const confirmDelete = async () => {
    try {
      const response = await APIsRequest.deleteApplicantRequest(deleteConfirmation.applicantId)
      const data = await response.json()

      if (!response.ok) {
        setAlertDetails({ status: 'error', message: data.error || 'Error', id: Date.now() });
        return;
      }

      setAlertDetails({ status: 'success', message: data.message || 'Error', id: Date.now() });
      await loadApplicants()
    } catch (error: any) {
      setAlertDetails({ status: 'error', message: error?.message || error?.error || 'An error occurred', id: Date.now() });
      console.error("Failed to delete applicant:", error)
    } finally {
      setTimeout(() => { setAlertDetails({ status: '', message: '', id: '' }); }, 1000);
      setDeleteConfirmation({ isOpen: false, applicantId: "", fullName: "" })
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, applicantId: "", fullName: "" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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
    <>
      <Sidebar />
      <Navbar />
      <div className="min-h-screen bg-[#e5edf9] animate-fade-up animation-fill-forwards">
        <main className="ml-20 pt-16 px-4 py-4 mx-auto -active-mini-active">
          <div className="flex flex-col xl:flex-row gap-6 mt-6">
            <div className="mt-6 flex-1 min-w-0">
              
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2" style={{ color: "#082777" }}> Applicants Management </h1>
                <p className="text-sm" style={{ color: "#4B93E7" }}> View and manage all applicant&apos;s status in the system </p>
              </div>

              {alertDetails.status && ( <MessageAlert status={alertDetails.status} message={alertDetails.message} id={alertDetails.id} /> )}

              <div className="bg-white-active rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-semibold mb-1" style={{ color: "#082777" }}> Applicants Management </h2>
                    <p className="text-sm text-gray-600">View and manage applicant&apos;s status</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search applicants..."
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
                        <SelectItem value="PENDING">PENDING</SelectItem>
                        <SelectItem value="REJECTED">REJECTED</SelectItem>
                        <SelectItem value="APPROVED">APPROVED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                { filteredApplicants.length > 0 && loading === false && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left p-4 font-medium text-gray-600">Applicants</th>
                          <th className="text-left p-4 font-medium text-gray-600">Applied Position</th>
                          <th className="text-left p-4 font-medium text-gray-600">Status</th>
                          <th className="text-left p-4 font-medium text-gray-600">Created At</th>
                          <th className="text-left p-4 font-medium text-gray-600">Updated At</th>
                          <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplicants.map((applicant) => (
                          <motion.tr key={applicant.id} className="border-b border-gray-100 hover:bg-gray-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                  <img src={applicant.Users?.profile_picture || "/user-avatar.png?height=40&width=40"} alt="Avatar" width={40} height={40} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <div className="font-medium" style={{ color: "#082777" }}> {applicant.full_name} </div>
                                  <div className="text-sm text-gray-500">{timeAgo(applicant.updated_at)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="font-medium" style={{ color: "#082777" }}> {applicant.Jobs.title} </span>
                            </td>
                            <td className="p-4">
                              <Badge className="text-white-active" style={{ backgroundColor: getStatusColor(applicant.status) }}> {applicant.status} </Badge>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-gray-600">{new Date(applicant.created_at).toLocaleString()}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-gray-600">{new Date(applicant.updated_at).toLocaleString()}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleViewApplicant(applicant)} className="text-gray-600 hover:text-gray-900" > View <Eye className="h-4 w-4 ml-1" /> </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteApplicant(applicant.id)} className="text-red-600 hover:text-red-900 hover:bg-red-50" > Delete <Trash2 className="h-4 w-4 ml-1" /> </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {filteredApplicants.length === 0 && loading === false && ( <div className="text-center py-12"> <p className="text-gray-500 mb-4"> No applicant found matching your search </p> </div> )}
              </div>

              {deleteConfirmation.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-actext-white-active-active rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold" style={{ color: "#082777" }}> Confirm Delete </h3>
                      <Button variant="ghost" size="sm" onClick={cancelDelete}> <X className="h-4 w-4" /> </Button>
                    </div>
                    <p className="text-gray-600 mb-6"> Are you sure you want to delete the applicant &ldquo;{deleteConfirmation.fullName}&quot;? This action cannot be undone. </p>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={cancelDelete}> Cancel </Button>
                      <Button onClick={confirmDelete} className="bg-red-600 text-white-active"> <Trash2 className="h-4 w-4 mr-2" /> Delete Applicant </Button>
                    </div>
                  </div>
                </div>
              )}

              <ApplicantManagementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} applicant={selectedApplicant} onSave={handleSaveApplicant} />
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