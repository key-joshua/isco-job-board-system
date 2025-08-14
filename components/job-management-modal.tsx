"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import MessageAlert from "@/components/messageAlert"
import { PdfAttachmentInput } from "./pdf-attachment-input"
import { APIsRequest } from "@/libs/requestAPIs/requestAPIs"
import { motion, AnimatePresence, Variants  } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@/components/ui/dialog"
import { X, User, MapPin, Calendar, DollarSign, FileText, Briefcase, Trash2, Edit, Clock, Gift, Building, Mail, } from "lucide-react"

interface JobManagementModalProps {
  job?: any
  isOpen: boolean
  onClose: () => void
  mode: "view" | "edit" | "create"
  onSave: (job?: any) => Promise<void>
}

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
}

const overlayVariants = {
  exit: { opacity: 0 },
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export function JobManagementModal({ isOpen, onClose, onSave, job, mode }: JobManagementModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentMode, setCurrentMode] = useState<"view" | "edit" | "create">(mode)
  const [alertDetails, setAlertDetails] = useState<{ status: '' | 'error' | 'success'; message: string; id: any }>({ status: '', message: '', id: 0 })
  const [formData, setFormData] = useState({ title: "", company: "", location: "", available_positions: 0, status: "OPEN", description: "", requirements: "", benefits: "", is_active: true, is_remote: false, is_urgent: false, type: "", department: "", experience: "", salary: "", deadline: "", contact_email: "", attachment: null as File | null, })

  useEffect(() => {
    if (job && mode !== "create") {
      setFormData({ title: job.title || "", company: job.company || "", location: job.location || "", available_positions: job.available_positions || 0, status: job.status || "OPEN", description: job.description || "", requirements: job.requirements || "", benefits: job.benefits || "", is_active: job.is_active ?? true, is_remote: job.is_remote ?? false, is_urgent: job.is_urgent ?? false, type: job.type || "", department: job.department || "", experience: job.experience || "", salary: job.salary || "", deadline: job.deadline || "", contact_email: job.contact_email || "", attachment: job.attachment || null, })
    } else if (mode === "create") {
      setFormData({ title: "", company: "", location: "", available_positions: 0, status: "OPEN", description: "", requirements: "", benefits: "", is_active: true, is_remote: false, is_urgent: false, type: "", department: "", experience: "", salary: "", deadline: "", contact_email: "", attachment: null, })
    }
  }, [job, mode])

  useEffect(() => {
    setCurrentMode(mode)
  }, [mode])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = "Job title is required"
    if (!formData.company.trim()) newErrors.company = "Company name is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.salary.trim()) newErrors.salary = "Salary is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.contact_email.trim()) newErrors.contact_email = "Contact email is required"
    if (!formData.deadline) newErrors.deadline = "Application deadline is required"
    if (formData.available_positions < 1) newErrors.available_positions = "Available positions must be at least 1"
    if (!formData.department.trim()) newErrors.department = "Department is required"
    if (!formData.status.trim()) newErrors.status = "Status is required"
    if (!formData.type.trim()) newErrors.type = "Job type is required"
    if (!formData.requirements.trim()) newErrors.requirements = "Requirements are required"
    if (!formData.benefits.trim()) newErrors.benefits = "Benefits are required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (currentMode !== "view" && validateForm()) {
      setIsLoading(true)
      try {
        if (currentMode === "create") {
          const response = await APIsRequest.createJobRequest(formData)
          const data = await response.json()

          if (!response.ok) {
            setAlertDetails({ status: 'error', message: data.error || 'Error', id: Date.now() });
            return;
          }

          setAlertDetails({ status: 'success', message: data.message || 'Error', id: Date.now() });
          await onSave()
        } else if (currentMode === "edit" && job?.id) {
          const response = await APIsRequest.updateJobRequest(formData, job.id)
          const data = await response.json()

          if (!response.ok) {
            setAlertDetails({ status: 'error', message: data.error || 'Error', id: Date.now() });
            return;
          }

          setAlertDetails({ status: 'success', message: data.message || 'Error', id: Date.now() });
          await onSave()
        }
      } catch (error: any) {
        setAlertDetails({ status: 'error', message: error?.message || error?.error || 'An error occurred', id: Date.now() });
        console.error("API call failed:", error)
      } finally {
        setTimeout(() => { setAlertDetails({ status: '', message: '', id: '' }); onClose(); setIsLoading(false); }, 3000);
      }
    }
  }

  const handleDelete = async () => {
    if (job?.id) {
      setIsLoading(true)
      try {
        const response = await APIsRequest.deleteJobRequest(job.id)
        const data = await response.json()

        if (!response.ok) {
          setAlertDetails({ status: 'error', message: data.error || 'Error', id: Date.now() });
          return;
        }

        setAlertDetails({ status: 'success', message: data.message || 'Error', id: Date.now() });
        await onSave()
      } catch (error: any) {
        setAlertDetails({ status: 'error', message: error?.message || error?.error || 'An error occurred', id: Date.now() });
        console.error("Delete API call failed:", error)
      } finally {
        setTimeout(() => { setAlertDetails({ status: '', message: '', id: '' }); onClose();  }, 1000);
        setShowDeleteDialog(false);
        setIsLoading(false);
      }
    }
  }

  const openAttachment = (url: string | null) => {
    if (url) window.open(url, "_blank")
  }

  const isReadOnly = currentMode === "view"

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div variants={overlayVariants} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose} >
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="bg-white-active rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()} >
              <div className="bg-gradient-to-r from-[#4B93E7] to-[#9dc2ef] text-white-active p-3 rounded-t-lg flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <div>
                      <h2 className="text-base font-semibold"> {currentMode === "create" ? "Create New Job" : currentMode === "edit" ? "Edit Job" : "Job Details"} </h2>
                      <p className="text-blue-100 text-xs"> {currentMode === "create" ? "Add a new job posting" : currentMode === "edit" ? "Update job information" : "View job information"} </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={onClose} className="text-white-active hover:bg-white-active/20 h-7 w-7 p-0" > <X className="h-3 w-3" /> </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                
                {alertDetails.status && ( <MessageAlert status={alertDetails.status} message={alertDetails.message} id={alertDetails.id} /> )}

                <div className="mb-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#e6eef8] rounded-lg p-2 border border-[#9dc2ef] w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3 text-[#082777]" />
                          <span className="text-xs font-medium text-[#082777]">Active Job</span>
                        </div>
                        <Switch
                          disabled={isReadOnly}
                          checked={formData.is_active}
                          className={`scale-75 ${formData.is_active ? "data-[state=checked]:bg-[#082777]" : ""}`}
                          onCheckedChange={(checked) => { setErrors({}); setFormData({ ...formData, is_active: checked, status: checked ? "OPEN" : "CLOSED", }) }}
                        />
                      </div>
                    </div>

                    <div className="bg-[#e6eef8] rounded-lg p-2 border border-[#9dc2ef] w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#4B93E7]" />
                          <span className="text-xs font-medium text-[#082777]">Remote Work</span>
                        </div>
                        <Switch
                          disabled={isReadOnly}
                          checked={formData.is_remote}
                          className={`scale-75 ${formData.is_remote ? "data-[state=checked]:bg-[#4B93E7]" : ""}`}
                          onCheckedChange={(checked) => { setErrors({}); setFormData({ ...formData, is_remote: checked, location: checked ? "Remote" : "Onsite" }) }}
                        />
                      </div>
                    </div>

                    <div className="bg-[#efe8d9] rounded-lg p-2 border border-[#FFC459] w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-[#F7AC25]" />
                          <span className="text-xs font-medium text-[#082777]">Urgent Hiring</span>
                        </div>
                        <Switch
                          disabled={isReadOnly}
                          checked={formData.is_urgent}
                          className={`scale-75 ${formData.is_urgent ? "data-[state=checked]:bg-[#F7AC25]" : ""}`}
                          onCheckedChange={(checked) => { setErrors({}); setFormData({ ...formData, is_urgent: checked, type: checked ? "Full Time" : "Part Time" }) }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="title" className="text-xs font-medium text-[#082777] mb-1 block"> <Briefcase className="h-3 w-3 inline mr-1" /> Job Title </Label>
                      <Input
                        id="title"
                        value={formData.title || ""}
                        onChange={(e) => { setErrors({}); setFormData({ ...formData, title: e.target.value }) }}
                        placeholder="Enter job title"
                        readOnly={isReadOnly}
                        className={`text-xs h-8 ${errors.title ? "border-[#F7AC25]" : ""} ${isReadOnly ? "bg-[#e6eef8]" : ""}`}
                      />
                      {errors.title && <p className="text-[#F7AC25] text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div>
                      <Label htmlFor="company" className="text-xs font-medium text-[#082777] mb-1 block"> <User className="h-3 w-3 inline mr-1" /> Company </Label>
                      <Input
                        id="company"
                        value={formData.company || ""}
                        onChange={(e) => { setErrors({}); setFormData({ ...formData, company: e.target.value }) }}
                        placeholder="Enter company name"
                        readOnly={isReadOnly}
                        className={`text-xs h-8 ${errors.company ? "border-[#F7AC25]" : ""} ${isReadOnly ? "bg-[#e6eef8]" : ""}`}
                      />
                      {errors.company && <p className="text-[#F7AC25] text-xs mt-1">{errors.company}</p>}
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-xs font-medium text-[#082777] mb-1 block"> <MapPin className="h-3 w-3 inline mr-1" /> Location </Label>
                      {isReadOnly ? (
                        <Input value={formData.location || ""} readOnly className="bg-[#e6eef8] text-xs h-8" />
                      ) : (
                        <Select
                          value={formData.location || ""}
                          onValueChange={(value) => { setErrors({}); setFormData({ ...formData, location: value, is_remote: value === "Remote", }) }}
                        >
                          <SelectTrigger className={`text-xs h-8 ${errors.location ? "border-[#F7AC25]" : ""}`}>
                            <SelectValue placeholder="Select work location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Onsite">Onsite</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                            <SelectItem value="Remote">Remote</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {errors.location && <p className="text-[#F7AC25] text-xs mt-1">{errors.location}</p>}
                    </div>

                    <div>
                      <Label htmlFor="salary" className="text-xs font-medium text-[#082777] mb-1 block"> <DollarSign className="h-3 w-3 inline mr-1" /> Salary </Label>
                      <Input
                        id="salary"
                        value={formData.salary || ""}
                        onChange={(e) => { setErrors({}); setFormData({ ...formData, salary: e.target.value }) }}
                        placeholder="Enter salary range"
                        readOnly={isReadOnly}
                        className={`text-xs h-8 ${errors.salary ? "border-[#F7AC25]" : ""} ${isReadOnly ? "bg-[#e6eef8]" : ""}`}
                      />
                      {errors.salary && <p className="text-[#F7AC25] text-xs mt-1">{errors.salary}</p>}
                    </div>

                    <div>
                      <Label htmlFor="available_positions" className="text-xs font-medium text-[#082777] mb-1 block"> <User className="h-3 w-3 inline mr-1" /> Available Positions </Label>
                      <Input
                        id="available_positions"
                        type="number"
                        min="1"
                        value={formData.available_positions || ""}
                        onChange={(e) => { setErrors({}); setFormData({ ...formData, available_positions: Number.parseInt(e.target.value) || 0 }) }}
                        placeholder="0"
                        readOnly={isReadOnly}
                        className={`text-xs h-8 ${errors.available_positions ? "border-[#F7AC25]" : ""} ${isReadOnly ? "bg-[#e6eef8]" : ""}`}
                      />
                      {errors.available_positions && (
                        <p className="text-[#F7AC25] text-xs mt-1">{errors.available_positions}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="requirements" className="text-xs font-medium text-[#082777] mb-1 block"> <FileText className="h-3 w-3 inline mr-1" /> Requirements </Label>
                      <Textarea
                        id="requirements"
                        value={formData.requirements || ""}
                        onChange={(e) => { setErrors({}); setFormData({ ...formData, requirements: e.target.value }) }}
                        placeholder="Enter job requirements"
                        rows={2}
                        readOnly={isReadOnly}
                        className={`text-xs ${errors.requirements ? "border-[#F7AC25]" : ""} ${isReadOnly ? "bg-[#e6eef8]" : ""}`}
                      />
                      {errors.requirements && <p className="text-[#F7AC25] text-xs mt-1">{errors.requirements}</p>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="department" className="text-xs font-medium text-[#082777] mb-1 block"> <Building className="h-3 w-3 inline mr-1" /> Department </Label>
                      <Input
                        id="department"
                        value={formData.department || ""}
                        onChange={(e) => { setErrors({}); setFormData({ ...formData, department: e.target.value }) }}
                        placeholder="Enter department"
                        readOnly={isReadOnly}
                        className={`text-xs h-8 ${errors.department ? "border-[#F7AC25]" : ""} ${isReadOnly ? "bg-[#e6eef8]" : ""}`}
                      />
                      {errors.department && <p className="text-[#F7AC25] text-xs mt-1">{errors.department}</p>}
                    </div>

                    <div>
                      <Label htmlFor="type" className="text-xs font-medium text-[#082777] mb-1 block"> <Clock className="h-3 w-3 inline mr-1" /> Job Type </Label>
                      {isReadOnly ? (
                        <Input value={formData.type || ""} readOnly className="bg-[#e6eef8] text-xs h-8" />
                      ) : (
                        <Select
                          value={formData.type || ""}
                          onValueChange={(value) => { setErrors({}); setFormData({ ...formData, type: value, is_urgent: value === "Full Time", }) }}
                        >
                          <SelectTrigger className={`text-xs h-8 ${errors.type ? "border-[#F7AC25]" : ""}`}>
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full Time">Full Time</SelectItem>
                            <SelectItem value="Part Time">Part Time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Freelance">Freelance</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {errors.type && <p className="text-[#F7AC25] text-xs mt-1">{errors.type}</p>}
                    </div>

                    <div>
                      <Label htmlFor="contact_email" className="text-xs font-medium text-[#082777] mb-1 block"> <Mail className="h-3 w-3 inline mr-1" /> Contact Email </Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={formData.contact_email || ""}
                        onChange={(e) => { setErrors({}); setFormData({ ...formData, contact_email: e.target.value }) }}
                        placeholder="Enter contact email"
                        readOnly={isReadOnly}
                        className={`text-xs h-8 ${errors.contact_email ? "border-[#F7AC25]" : ""} ${isReadOnly ? "bg-[#e6eef8]" : ""}`}
                      />
                      {errors.contact_email && <p className="text-[#F7AC25] text-xs mt-1">{errors.contact_email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="deadline" className="text-xs font-medium text-[#082777] mb-1 block"> <Calendar className="h-3 w-3 inline mr-1" /> Application Deadline </Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline || ""}
                        onChange={(e) => { setErrors({}); setFormData({ ...formData, deadline: e.target.value }) }}
                        readOnly={isReadOnly}
                        className={`text-xs h-8 ${errors.deadline ? "border-[#F7AC25]" : ""} ${isReadOnly ? "bg-[#e6eef8]" : ""}`}
                      />
                      {errors.deadline && <p className="text-[#F7AC25] text-xs mt-1">{errors.deadline}</p>}
                    </div>

                    <div>
                      <Label htmlFor="status" className="text-xs font-medium text-[#082777] mb-1 block"> <Clock className="h-3 w-3 inline mr-1" /> Status </Label>
                      {isReadOnly ? (
                        <Input value={formData.status || ""} readOnly className="bg-[#e6eef8] text-xs h-8" />
                      ) : (
                        <Select
                          value={formData.status || ""}
                          onValueChange={(value) => { setErrors({}); setFormData({ ...formData, status: value, is_active: value === "OPEN", }) }}
                        >
                          <SelectTrigger className={`text-xs h-8 ${errors.status ? "border-[#F7AC25]" : ""}`}>
                            <SelectValue placeholder="OPEN" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OPEN">Open</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {errors.status && <p className="text-[#F7AC25] text-xs mt-1">{errors.status}</p>}
                    </div>

                    <div>
                      <Label htmlFor="benefits" className="text-xs font-medium text-[#082777] mb-1 block"> <Gift className="h-3 w-3 inline mr-1" /> Benefits </Label>
                      <Textarea
                        id="benefits"
                        value={formData.benefits || ""}
                        onChange={(e) => { setErrors({}); setFormData({ ...formData, benefits: e.target.value }) }}
                        placeholder="Enter job benefits"
                        rows={2}
                        readOnly={isReadOnly}
                        className={`text-xs ${errors.benefits ? "border-[#F7AC25]" : ""} ${isReadOnly ? "bg-[#e6eef8]" : ""}`}
                      />
                      {errors.benefits && <p className="text-[#F7AC25] text-xs mt-1">{errors.benefits}</p>}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="description" className="text-xs font-medium text-[#082777] mb-1 block"> Job Description </Label>
                  <textarea
                    id="description"
                    readOnly={isReadOnly}
                    value={formData.description || ""}
                    placeholder="Enter detailed job description..."
                    onChange={(e) => { setErrors({}); setFormData({ ...formData, description: e.target.value }) }}
                    className={`w-full min-h-[80px] px-2 py-2 border border-[#9dc2ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B93E7] focus:border-transparent resize-vertical text-xs ${errors.description ? "border-[#F7AC25]" : ""} ${isReadOnly ? "bg-[#e6eef8]" : ""}`}
                  />
                  {errors.description && <p className="text-[#F7AC25] text-xs mt-1">{errors.description}</p>}
                </div>

                <div className="mb-4">
                  <Label className="text-xs font-medium text-[#082777] mb-1 block">PDF Job Attachment (Optional)</Label>
                  {
                    currentMode === "view" 
                    ? ( <div className="p-2 border border-[#9dc2ef] rounded-lg bg-[#e6eef8]">
                      {
                        job?.attachment
                        ? ( <div className="flex items-center gap-2"> <FileText className="h-4 w-4 text-[#4B93E7]" /> <button onClick={() => openAttachment(job.attachment)} className="text-xs text-[#4B93E7] hover:text-[#082777] underline cursor-pointer" > View Job Attachment </button> </div> )
                        : ( <p className="text-xs text-[#082777]">No Job Attachment</p> ) } </div> ) 
                    : ( <PdfAttachmentInput newJob={formData} setNewJob={setFormData} errors={errors} setErrors={setErrors} /> )
                  }
                </div>
              </div>

              <div className="flex-shrink-0 p-3 border-t border-[#e6eef8] bg-white-active rounded-b-2xl">
                <div className="flex justify-end gap-2">
                  {currentMode === "view" && (
                    <>
                      <Button onClick={() => setCurrentMode("edit")} className="bg-[#4B93E7] hover:bg-[#082777] text-white-active text-xs px-3 py-1 h-8" > <Edit className="h-3 w-3 mr-1" /> Edit Job </Button>
                      <Button onClick={() => setShowDeleteDialog(true)} variant="destructive" className="bg-red-500 text-white-active text-xs px-3 py-1 h-8" > <Trash2 className="h-3 w-3 mr-1" /> Delete </Button>
                    </>
                  )}
                  {currentMode === "create" && (
                    <>
                      <Button onClick={onClose} variant="outline" disabled={isLoading} className="border-[#9dc2ef] text-[#082777] hover:bg-[#e6eef8] text-xs px-3 py-1 h-8 bg-transparent" > Cancel </Button>
                      <Button onClick={handleSubmit} disabled={isLoading} className="bg-[#F7AC25] text-white-active text-xs px-3 py-1 h-8" > {isLoading ? "Saving..." : "Save Job"} </Button>
                    </>
                  )}
                  {currentMode === "edit" && (
                    <>
                      <Button onClick={onClose} variant="outline" disabled={isLoading} className="border-[#9dc2ef] text-[#082777] hover:bg-[#e6eef8] text-xs px-3 py-1 h-8 bg-transparent" > Cancel </Button>
                      <Button onClick={handleSubmit} disabled={isLoading} className="bg-[#F7AC25] text-white-active text-xs px-3 py-1 h-8" > {isLoading ? "Saving..." : "Save Changes"} </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showDeleteDialog && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#082777]">Confirm Delete</DialogTitle>
              <DialogDescription> Are you sure you want to delete this job? This action cannot be undone. </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isLoading} className="border-[#9dc2ef] text-[#082777] hover:bg-[#e6eef8]" > Cancel </Button>
              <Button onClick={handleDelete} disabled={isLoading} className="bg-red-600 text-white-active" > {isLoading ? "Deleting..." : "Delete"} </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}