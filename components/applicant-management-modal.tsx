"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import MessageAlert from "@/components/messageAlert"
import { APIsRequest } from "@/libs/requestAPIs/requestAPIs"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { X, User, Mail, FileText, Briefcase, Calendar, Building, MapPin, DollarSign, Clock } from "lucide-react"

interface ApplicantData {
  id: string
  user_id: string
  job_id: string
  full_name: string
  email: string
  status: string
  message: string
  cover_letter: string | null
  resume: string | null
  created_at: string
  updated_at: string
  Users: {
    id: string
    username: string
    profile_picture: string
    email: string
    role: string
  }
  Jobs: {
    id: string
    title: string
    company: string
    department: string
    location: string
    salary: string
    type: string
    status: string
    description: string
    deadline: string
  }
}

interface ApplicantManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => Promise<void>
  applicant: ApplicantData | null
}

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
}

const overlayVariants = {
  exit: { opacity: 0 },
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export function ApplicantManagementModal({ isOpen, onClose, applicant, onSave }: ApplicantManagementModalProps) {
  const [currentStatus, setCurrentStatus] = useState("")
  const [alertDetails, setAlertDetails] = useState<{ status: '' | 'error' | 'success'; message: string; id: any }>({ status: '', message: '', id: 0 })

  useEffect(() => {
    setCurrentStatus(applicant?.status || "PENDING")
  }, [applicant])


  const handleStatusUpdate = async (newStatus: string) => {
    if (!applicant) return;

    try {
        const response = await APIsRequest.updateApplicantRequest({ status: newStatus }, applicant.id)
        const data = await response.json()

        if (!response.ok) {
            setAlertDetails({ status: 'error', message: data.error || 'Error', id: Date.now() });
            return;
        }

        setAlertDetails({ status: 'success', message: data.message || 'Error', id: Date.now() });
        setCurrentStatus(newStatus)
        await onSave()
    } catch (error: any) {
        setAlertDetails({ status: 'error', message: error?.message || error?.error || 'An error occurred', id: Date.now() });
        console.error("Failed to update status:", error)
    } finally {
        setTimeout(() => { setAlertDetails({ status: '', message: '', id: '' });  }, 3000);
    }
  }

  const openAttachment = (url: string | null) => {
    if (url) window.open(url, "_blank")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-[#4B93E7]"
      case "REJECTED":
        return "bg-red-500"
      case "PENDING":
        return "bg-[#F7AC25]"
      default:
        return "bg-[#082777]"
    }
  }
  
  if (!applicant) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div variants={overlayVariants} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose} >
          <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="bg-white-active rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()} >
            <div className="bg-gradient-to-r from-[#4B93E7] to-[#9dc2ef] text-white-active p-4 rounded-t-2xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5" />
                  <div>
                    <h2 className="text-lg font-semibold">Applicant Details</h2>
                    <p className="text-blue-100 text-sm">View applicant information</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="text-white-active hover:bg-white-active/20 h-8 w-8 p-0" > <X className="h-4 w-4" /> </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">

              {alertDetails.status && ( <MessageAlert status={alertDetails.status} message={alertDetails.message} id={alertDetails.id} /> )}

              <div className="mb-6">
                <div className="grid grid-cols-3 gap-3">
                  <div onClick={() => handleStatusUpdate("PENDING")} className={`p-3 rounded-lg border cursor-pointer transition-all ${ currentStatus === "PENDING" ? "bg-[#F7AC25] border-[#F7AC25] text-white-active" : "bg-[#efe8d9] border-[#efe8d9] text-[#F7AC25] hover:text-white-active" }`} >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"> <Clock className="h-4 w-4" /> <span className="text-sm font-medium">Pending</span> </div>
                      <div className={`w-10 h-6 rounded-full relative transition-colors ${ currentStatus === "PENDING" ? "bg-white-active/30" : "bg-[#F7AC25]/30" }`} >
                        <div className={`w-4 h-4 rounded-full absolute top-1 transition-all ${ currentStatus === "PENDING" ? "left-5 bg-white-active" : "left-1 bg-[#F7AC25]" }`} />
                      </div>
                    </div>
                  </div>

                  <div onClick={() => handleStatusUpdate("APPROVED")} className={`p-3 rounded-lg border cursor-pointer transition-all ${ currentStatus === "APPROVED" ? "bg-[#4B93E7] border-[#4B93E7] text-white-active" : "bg-[#d3e4f8] border-[#d3e4f8] text-[#4B93E7] hover:text-white-active" }`} >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"> <User className="h-4 w-4" /> <span className="text-sm font-medium">Approved</span> </div>
                      <div className={`w-10 h-6 rounded-full relative transition-colors ${ currentStatus === "APPROVED" ? "bg-white-active/30" : "bg-[#4B93E7]/30" }`} >
                        <div className={`w-4 h-4 rounded-full absolute top-1 transition-all ${ currentStatus === "APPROVED" ? "left-5 bg-white-active" : "left-1 bg-[#4B93E7]" }`} />
                      </div>
                    </div>
                  </div>

                  <div onClick={() => handleStatusUpdate("REJECTED")} className={`p-3 rounded-lg border cursor-pointer transition-all ${ currentStatus === "REJECTED" ? "bg-red-500 border-red-500 text-white-active" : "bg-red-100 border-red-100 text-red-500 hover:text-white-active" }`} >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"> <X className="h-4 w-4" /> <span className="text-sm font-medium">Rejected</span> </div>
                      <div className={`w-10 h-6 rounded-full relative transition-colors ${ currentStatus === "REJECTED" ? "bg-white-active/30" : "bg-red-500/30" }`} >
                        <div className={`w-4 h-4 rounded-full absolute top-1 transition-all ${ currentStatus === "REJECTED" ? "left-5 bg-white-active" : "left-1 bg-red-500" }`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#e6eef8] rounded-lg p-6 mb-6 border border-[#9dc2ef]">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-white-active shadow-md">
                    <img src={applicant.Users?.profile_picture || "/user-avatar.png"} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-[#082777] mb-1">{applicant.full_name}</h3>
                        <div className="flex items-center gap-2 text-sm text-[#4B93E7] mb-2">
                          <Mail className="h-4 w-4" />
                          {applicant.email}
                        </div>
                      </div>
                      <Badge className={`text-white-active ${getStatusColor(currentStatus)}`}>{currentStatus}</Badge>
                    </div>
                    <div className="bg-white-active rounded-lg p-3 border border-[#9dc2ef]">
                      <div className="flex items-center gap-2 text-[#082777]">
                        <Briefcase className="h-4 w-4" />
                        <span className="font-medium">Applied For: {`${applicant.Jobs?.title} ( ${applicant.Jobs?.department} )`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-[#082777] border-b border-[#9dc2ef] pb-2"> Job Information </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-[#4B93E7]" />
                      <span className="text-sm font-medium text-[#082777]">Company:</span>
                      <span className="text-sm text-gray-600">{applicant.Jobs?.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#4B93E7]" />
                      <span className="text-sm font-medium text-[#082777]">Salary:</span>
                      <span className="text-sm text-gray-600">{applicant.Jobs?.salary}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-[#082777] border-b border-[#9dc2ef] pb-2"> Job Location </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#4B93E7]" />
                      <span className="text-sm font-medium text-[#082777]">Location:</span>
                      <span className="text-sm text-gray-600">{applicant.Jobs?.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#4B93E7]" />
                      <span className="text-sm font-medium text-[#082777]">Type:</span>
                      <span className="text-sm text-gray-600">{applicant.Jobs?.type}</span>
                    </div>
                  </div>
                </div>                

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-[#082777] border-b border-[#9dc2ef] pb-2"> Application Details </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#4B93E7]" />
                      <span className="text-sm font-medium text-[#082777]">Applied:</span>
                      <span className="text-sm text-gray-600"> {new Date(applicant.created_at).toLocaleDateString()} </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#4B93E7]" />
                      <span className="text-sm font-medium text-[#082777]">Deadline:</span>
                      <span className="text-sm text-gray-600"> {new Date(applicant.Jobs.deadline).toLocaleDateString()} </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#082777] border-b border-[#9dc2ef] pb-2">Attachments</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#e6eef8] rounded-lg p-4 border border-[#9dc2ef]">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-[#4B93E7]" />
                      <div className="flex-1">
                        <h5 className="font-medium text-[#082777] mb-1">Cover Letter</h5>
                        {applicant.cover_letter ? (
                          <button onClick={() => openAttachment(applicant.cover_letter)} className="text-sm text-[#4B93E7] hover:text-[#082777] hover:underline cursor-pointer" > View Cover Letter </button>
                        ) : (
                          <span className="text-sm text-gray-500">Not provided</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#e6eef8] rounded-lg p-4 border border-[#9dc2ef]">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-[#F7AC25]" />
                      <div className="flex-1">
                        <h5 className="font-medium text-[#082777] mb-1">Resume</h5>
                        {applicant.resume ? (
                          <button onClick={() => openAttachment(applicant.resume)} className="text-sm text-[#4B93E7] hover:text-[#082777] hover:underline cursor-pointer" > View Resume </button>
                        ) : (
                          <span className="text-sm text-gray-500">Not provided</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {applicant.Jobs?.description && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-lg font-semibold text-[#082777] border-b border-[#9dc2ef] pb-2"> Applicant Message </h4>
                  <div className="bg-[#e6eef8] rounded-lg p-4 border border-[#9dc2ef]"> <p className="text-sm text-gray-700 leading-relaxed">{applicant.message}</p> </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
