"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Search, MapPin, Calendar, DollarSign, Eye, Send, Users, Clock, Globe, Building2, Shuffle } from "lucide-react"


import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { authVerify } from "@/libs/utils/utils"
import { Button } from "@/components/ui/button"
import MessageAlert from "@/components/messageAlert"
import { APIsRequest } from "@/libs/requestAPIs/requestAPIs"
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
  deadline: string
  is_active: boolean
  is_remote: boolean
  is_urgent: boolean
  available_positions: number
  created_at: string
  updated_at: string
}

export default function Jobs() {
  const [user, setUsr] = useState<any>({});
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("All Types")
  const [locationFilter, setLocationFilter] = useState("All Locations")
  const [alertDetails, setAlertDetails] = useState<{ status: '' | 'error' | 'success'; message: string; id: any }>({ status: '', message: '', id: 0 })

  useEffect(() => {
        const getUserProfile = async () => {
            const { user }: any = await authVerify();
            setUsr(user);
        }
    
        getUserProfile();
   }, []);

  useEffect(() => {
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
            setLoading(false); 
            setTimeout(() => { setAlertDetails({ status: '', message: '', id: '' }); }, 3000);
        }
    }

    loadJobs()
  }, []);

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

  const handleApply = (job: Job) => {
    window.open(`/jobs/${job.id}`, "_blank", "noopener,noreferrer");
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.company.toLowerCase().includes(searchTerm.toLowerCase()) || job.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = locationFilter === "All Locations" || job.location === locationFilter
    const matchesType = typeFilter === "All Types" || job.type === typeFilter

    return matchesSearch && matchesLocation && matchesType
  })

  const totalJobs = jobs.length
  const onsiteJobs = jobs.filter((job) => job.location === "Onsite").length
  const hybridJobs = jobs.filter((job) => job.location === "Hybrid").length
  const remoteJobs = jobs.filter((job) => job.location === "Remote").length

  return (
    <>
        <Sidebar />
        <Navbar />
        <div className="min-h-screen bg-[#e5edf9] animate-fade-up animation-fill-forwards">
            <main className="ml-20 pt-16 px-4 py-4 mx-auto -active-mini-active">
                    <div className="flex flex-col xl:flex-row gap-6 mt-6">
                        <div className="mt-6 flex-1 min-w-0">

                            <div className="text-start mb-8">
                                <h1 className="text-4xl font-bold text-[#082777] mb-2">Find Your Dream Job</h1>
                                <p className="text-[#4B93E7] text-lg">Discover amazing opportunities and take the next step in your career</p>
                            </div>

                            
                            {alertDetails.status && ( <MessageAlert status={alertDetails.status} message={alertDetails.message} id={alertDetails.id} /> )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <motion.div className="bg-primary-active text-white-active p-6 rounded-lg shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white-active/80 text-sm">Total Jobs</p>
                                            <p className="text-3xl font-bold">{totalJobs}</p>
                                        </div>
                                        <Users className="h-8 w-8 text-white-active/60" />
                                    </div>
                                </motion.div>

                                <motion.div className="bg-primary-mini-active text-white-active p-6 rounded-lg shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white-active/80 text-sm">Onsite Jobs</p>
                                            <p className="text-3xl font-bold">{onsiteJobs}</p>
                                        </div>
                                        <MapPin className="h-8 w-8 text-white-active/60" />
                                    </div>
                                </motion.div>

                                <motion.div className="bg-secondary-active text-white-active p-6 rounded-lg shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white-active/80 text-sm">Remote Jobs</p>
                                            <p className="text-3xl font-bold">{remoteJobs}</p>
                                        </div>
                                        <Globe className="h-8 w-8 text-white-active/60" />
                                    </div>
                                </motion.div>

                                <motion.div className="bg-primary-semi-active text-white-active p-6 rounded-lg shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white-active/80 text-sm">Hybrid Jobs</p>
                                            <p className="text-3xl font-bold">{hybridJobs}</p>
                                        </div>
                                        <Clock className="h-8 w-8 text-white-active/60" />
                                    </div>
                                </motion.div>
                            </div>

                            <div className="bg-white-active rounded-lg shadow-sm p-6 mb-8">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <Input placeholder="Search jobs, companies, or locations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-12" />
                                    </div>

                                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                                        <SelectTrigger className="w-full md:w-48 h-12"> <SelectValue /> </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All Locations">All Locations</SelectItem>
                                            <SelectItem value="Onsite">Onsite</SelectItem>
                                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                                            <SelectItem value="Remote">Remote</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                                        <SelectTrigger className="w-full md:w-48 h-12"> <SelectValue /> </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All Types">All Types</SelectItem>
                                            <SelectItem value="Full Time">Full Time</SelectItem>
                                            <SelectItem value="Part Time">Part Time</SelectItem>
                                            <SelectItem value="Contract">Contract</SelectItem>
                                            <SelectItem value="Freelance">Freelance</SelectItem>
                                            <SelectItem value="Internship">Internship</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            { filteredJobs.length > 0 && loading === false && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredJobs.map((job, index) => (
                                        <motion.div key={job.id} className="bg-white-active rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-[#082777] mb-1">{job.title}</h3>
                                                    <div className="flex items-center text-[#4B93E7] mb-2"> <span className="text-sm">{job.company}</span> </div>
                                                </div>
                                                {job.location === 'Onsite' && <Badge className="bg-[#F7AC25] text-white-active"> <Building2 className="h-3 w-3 mr-1" /> Onsite</Badge>}
                                                {job.location === 'Hybrid' && <Badge className="bg-[#9dc2ef] text-white-active ml-2"> <Shuffle className="h-3 w-3 mr-1" /> Hybrid</Badge>}
                                                {job.location === 'Remote' && <Badge className="bg-[#9dc2ef] text-white-active ml-2"> <Globe className="h-3 w-3 mr-1" /> Remote</Badge>}
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-gray-600 text-sm">
                                                <   MapPin className="h-4 w-4 mr-2" /> {job.location}
                                                </div>
                                                <div className="flex items-center text-gray-600 text-sm">
                                                    <DollarSign className="h-4 w-4 mr-2" /> {job.salary}
                                                </div>
                                                <div className="flex items-center text-gray-600 text-sm">
                                                    <Calendar className="h-4 w-4 mr-2" /> Deadline: {new Date(job.deadline).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <Badge className="bg-[#082777] text-white-active mr-2">{job.type}</Badge>
                                                <Badge className="text-white-active" style={{ backgroundColor: getStatusColor(job.status) }}> {job.status} </Badge>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-6">
                                                {job.description.length > 130 ? `${job.description.substring(0, 130)}...` : job.description}
                                            </p>

                                            <div className="flex justify-end">
                                                { user.Applicants?.some((item: any) => item.job_id === job.id)
                                                    ? (<Button size="sm" className="w-1/2 bg-primary-mini-active text-white-active" > ✓ Already Applied </Button>)
                                                    : (<Button disabled={job.status === "CLOSED"} onClick={() => handleApply(job)} size="sm" className="w-1/2 bg-[#F7AC25] hover:bg-[#F7AC25]/90 text-white-active" > <Send className="h-4 w-4 mr-2" /> Apply Now </Button>)
                                                }
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {filteredJobs.length === 0 && loading === false && (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4"> <Search className="h-16 w-16 mx-auto mb-4" /> </div>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
                                    <p className="text-gray-500">Try adjusting your search criteria to find more opportunities.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
        </div>      
    </>
)}