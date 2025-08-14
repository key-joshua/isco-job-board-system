"use client"

import type React from "react"
import { useState } from "react"
import { X, User, Mail, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import MessageAlert from "@/components/messageAlert"
import { Card, CardContent } from "@/components/ui/card"
import { PdfAttachmentInput } from "./pdf-attachment-input"
import { APIsRequest } from "@/libs/requestAPIs/requestAPIs"

interface ApplicationFormModalProps {
  jobId: string
  isOpen: boolean
  company: string
  jobTitle: string
  onClose: () => void
  onSave: () => Promise<void>
}

interface ApplicationData {
  full_name: string
  email: string
  phone: string
  message: string
  cover_letter_file: File | null
  resume_file: File | null
}

export function ApplicationFormModal({ onSave, isOpen, onClose, jobTitle, company, jobId }: ApplicationFormModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, any>>({})
  const [alertDetails, setAlertDetails] = useState<{ status: '' | 'error' | 'success'; message: string; id: any }>({ status: '', message: '', id: 0 })
  const [formData, setFormData] = useState<ApplicationData>({ full_name: "", email: "", phone: "", message: "", cover_letter_file: null, resume_file: null, })

  const handleInputChange = (field: keyof ApplicationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.resume_file) newErrors.resume_file = "Resume is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.message) newErrors.message = "Message is required"
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setSubmitting(true)

    try {      
     const response = await APIsRequest.createApplicantRequest(formData, jobId)
     const data = await response.json()

     if (!response.ok) {
        setAlertDetails({ status: 'error', message: data.error || 'Error', id: Date.now() });
        return;
     }

     await onSave()
     setSubmitted(true)
     setAlertDetails({ status: 'success', message: data.message || 'Error', id: Date.now() })
     setFormData({ full_name: "", email: "", phone: "", message: "", cover_letter_file: null, resume_file: null })
    } catch (error: any) {
      setAlertDetails({ status: 'error', message: error?.message || error?.error || 'An error occurred', id: Date.now() });
      console.error("Failed to submit application:", error)
    } finally {
      setTimeout(() => { setAlertDetails({ status: '', message: '', id: '' }); onClose(); }, 3000);
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!submitting) {
      onClose()
      setErrors({})
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden" >
            <Card className="border-0 shadow-2xl bg-white-active">
              <div className="bg-gradient-to-r from-[#4B93E7] to-[#9dc2ef] p-6 text-white-active">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Apply For Position</h2>
                    <p className="text-white-active/90"> {jobTitle} at {company} </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleClose} className="text-white-active hover:bg-white-active/20" disabled={submitting} > <X className="h-5 w-5" /> </Button>
                </div>
              </div>

              <CardContent className="p-0">
                <div className="max-h-[60vh] overflow-y-auto">
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        
                      {alertDetails.status && ( <MessageAlert status={alertDetails.status} message={alertDetails.message} id={alertDetails.id} /> )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="full_name" className="text-xs font-medium text-[#082777] flex items-center gap-1" > <User className="h-3 w-3" /> Full Name </Label>
                          <Input id="full_name" value={formData.full_name} onChange={(e) => handleInputChange("full_name", e.target.value)} className="h-8 border-[#9dc2ef] focus:border-[#4B93E7]" placeholder="Enter your full name" />
                          {errors.full_name && <p className="text-red-500 text-xs">{errors.full_name}</p>}
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="email" className="text-xs font-medium text-[#082777] flex items-center gap-1"> <Mail className="h-3 w-3" /> Email Address </Label>
                          <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="h-8 border-[#9dc2ef] focus:border-[#4B93E7]" placeholder="Enter your email" />
                          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="phone" className="text-xs font-medium text-[#082777]"> Phone Number </Label>
                        <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className="h-8 border-[#9dc2ef] focus:border-[#4B93E7]" placeholder="Enter your phone number" />
                        {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="message" className="text-xs font-medium text-[#082777]"> Message </Label>
                        <Textarea id="message" value={formData.message} onChange={(e) => handleInputChange("message", e.target.value)} rows={3} className="border-[#9dc2ef] focus:border-[#4B93E7] resize-none" placeholder="Tell us why you're interested in this position..." />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs font-medium text-[#082777]">Cover Letter (PDF)</Label>
                          <PdfAttachmentInput newJob={{ attachment: formData.cover_letter_file }} setNewJob={(data: any) => setFormData((prev) => ({ ...prev, cover_letter_file: data.attachment })) } errors={ errors.cover_letter_file ? { attachment: { message: errors.cover_letter_file } } : {} } setErrors={(err: any) => setErrors((prev) => ({ ...prev, cover_letter_file: err.attachment?.message || "" })) } />
                          <p className="text-xs text-gray-500">Optional PDF file</p>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-medium text-[#082777]">Resume (PDF) *</Label>
                          <PdfAttachmentInput newJob={{ attachment: formData.resume_file }} setNewJob={(data: any) => setFormData((prev) => ({ ...prev, resume_file: data.attachment })) } errors={errors.resume_file ? { attachment: { message: errors.resume_file } } : {}} setErrors={(err: any) => setErrors((prev) => ({ ...prev, resume_file: err.attachment?.message || "" })) } />
                          {errors.resume_file && <p className="text-red-500 text-xs">{errors.resume_file}</p>}
                        </div>
                      </div>
                    </form>
                </div>

                {!submitted && (
                  <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <Button type="submit" onClick={handleSubmit} disabled={submitting} className="bg-[#4B93E7] hover:bg-[#082777] text-white-active" >
                        {
                            submitting
                            ? (<> <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white-active mr-2"></div> Submitting... </>)
                            : (<> <Send className="h-4 w-4 mr-2" /> Submit Application </>)
                        }
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
