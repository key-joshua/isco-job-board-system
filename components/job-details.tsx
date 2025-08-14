"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, MapPin, Calendar, DollarSign, Users, Clock, Building, Mail, Send, CheckCircle, Globe, Building2, Shuffle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { authVerify } from "@/libs/utils/utils"
import MessageAlert from "@/components/messageAlert"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { APIsRequest } from "@/libs/requestAPIs/requestAPIs"
import { ApplicationFormModal } from "./application-form-modal"

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
  deadline: string
  is_active: boolean
  is_remote: boolean
  is_urgent: boolean
  available_positions: number
  created_at: string
  updated_at: string
  department?: string
}

interface JobDetailsPageProps {
  jobId: string
}

export function JobDetails({ jobId}: JobDetailsPageProps) {
  const router = useRouter()
  const [user, setUsr] = useState<any>({});
  const [job, setJob] = useState<Job | null>(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [alertDetails, setAlertDetails] = useState<{ status: '' | 'error' | 'success'; message: string; id: any }>({ status: '', message: '', id: 0 })

  const loadJobDetails = useCallback(async () => {
    try {
      const response = await APIsRequest.getJobRequest(jobId)
      const data = await response.json()
      if (!response.ok) {
        setAlertDetails({ status: 'error', message: data.error || 'Error', id: Date.now() })
        return
      }
      setJob(data.data)
    } catch (error: any) {
      setAlertDetails({ status: 'error', message: error?.message || error?.error || 'An error occurred', id: Date.now() })
      console.error("Failed to load job details:", error)
    } finally {
      setTimeout(() => { setAlertDetails({ status: '', message: '', id: '' }) }, 3000)
    }
  }, [jobId])

  const getUserProfile = async () => {
    const { user }: any = await authVerify();
    setUsr(user);
  }

  useEffect(() => {
    loadJobDetails()
    getUserProfile()
  }, [loadJobDetails])

  const handleApply = async () => {
    if (!job) return
    setShowApplicationModal(true)
  }

  if (!job) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6eef8] to-[#d3e4f8]">
      <div className="max-w-[95rem] mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex justify-between items-center" >
          <Button variant="ghost" onClick={() => router.push("/jobs")} className="text-[#4B93E7] hover:text-[#082777] hover:bg-white-active/50" > <ArrowLeft className="h-4 w-4 mr-2" /> Back to Jobs </Button>
          {
            user.Applicants?.some((item: any) => item.job_id === job.id)
            ? (<Button size="sm" className="bg-primary-mini-active text-white-active" > ✓ Already Applied </Button>)
            : job.status === 'CLOSED'
            ? (<Button size="sm" className="bg-[#ef4444] text-white-active" > Application Closed </Button>)
            : (<Button size="sm" className="bg-[#F7AC25] text-white-active" > Application Open </Button>)
          }
        </motion.div>
        
        {alertDetails.status && ( <MessageAlert status={alertDetails.status} message={alertDetails.message} id={alertDetails.id} /> )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-0 shadow-lg bg-white-active/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-[#082777] mb-2">{job.title}</h1>
                      <div className="flex items-center text-[#4B93E7] text-lg mb-4"> <Building className="h-5 w-5 mr-2" /> {job.company} </div>
                    </div>
                    <div className="flex flex-col gap-2">                      
                      {job.location === 'Onsite' && <Badge className="bg-[#F7AC25] text-white-active"> <Building2 className="h-3 w-3 mr-1" /> Onsite</Badge>}
                      {job.location === 'Hybrid' && <Badge className="bg-[#9dc2ef] text-white-active ml-2"> <Shuffle className="h-3 w-3 mr-1" /> Hybrid</Badge>}
                      {job.location === 'Remote' && <Badge className="bg-[#9dc2ef] text-white-active ml-2"> <Globe className="h-3 w-3 mr-1" /> Remote</Badge>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 mr-3 text-[#4B93E7]" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-gray-600">{job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="h-5 w-5 mr-3 text-[#4B93E7]" />
                      <div>
                        <p className="font-medium">Salary</p>
                        <p className="text-sm text-gray-600">{job.salary}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-5 w-5 mr-3 text-[#4B93E7]" />
                      <div>
                        <p className="font-medium">Job Type</p>
                        <p className="text-sm text-gray-600">{job.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users className="h-5 w-5 mr-3 text-[#4B93E7]" />
                      <div>
                        <p className="font-medium">Positions Available</p>
                        <p className="text-sm text-gray-600">{job.available_positions}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 mr-3 text-[#4B93E7]" />
                      <div>
                        <p className="font-medium">Application Deadline</p>
                        <p className="text-sm text-gray-600">{new Date(job.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Mail className="h-5 w-5 mr-3 text-[#4B93E7]" />
                      <div>
                        <p className="font-medium">Contact</p>
                        <p className="text-sm text-gray-600">{job.contact_email}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-0 shadow-lg bg-white-active/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#082777] mb-4">Job Description</h2>
                  <div className="prose prose-gray max-w-none"> <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p> </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-0 shadow-lg bg-white-active/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#082777] mb-4">Requirements</h2>
                  <div className="prose prose-gray max-w-none"> <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.requirements}</p> </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="border-0 shadow-lg bg-white-active/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#082777] mb-4">Benefits</h2>
                  <div className="prose prose-gray max-w-none"> <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.benefits}</p> </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-[#F7AC25] to-[#FFC459] text-white sticky top-8">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-white/90" />
                    <h3 className="text-2xl font-bold mb-2">Ready to Apply ?</h3>
                    <p className="text-white/90">Take the next step in your career journey with {job.company}</p>
                  </div>

                  { user.Applicants?.some((item: any) => item.job_id === job.id)
                    ? (<Button size="sm" className="w-1/2 bg-primary-mini-active text-white-active" > ✓ Already Applied </Button>)
                    : (<Button disabled={job.status === "CLOSED"} onClick={handleApply} size="sm" className="w-full bg-white-active text-[#F7AC25] hover:bg-white-active/90 font-semibold py-3 text-lg" ><Send className="h-5 w-5 mr-2" /> Apply Now </Button>)
                  }

                  <Separator className="my-6 bg-white-active/20" />
                  <div className="text-sm text-white/80">
                    <p className="mb-2">Please fill out the application form below</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-0 shadow-lg bg-white-active/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-[#082777] mb-4">Job Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Posted</span>
                      <span className="text-sm text-gray-700">{new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Updated</span>
                      <span className="text-sm text-gray-700">{new Date(job.updated_at).toLocaleDateString()}</span>
                    </div>
                    {job.department && ( <div className="flex justify-between"> <span className="text-gray-600">Department</span> <span className="text-sm text-gray-700">{job.department}</span> </div> )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {job && ( <ApplicationFormModal onSave={async() => await getUserProfile()} isOpen={showApplicationModal} onClose={() => setShowApplicationModal(false)} jobTitle={job.title} company={job.company} jobId={job.id} /> )}
    </div>
  )
}
