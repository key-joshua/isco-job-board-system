"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Overview } from "@/components/overview"
import { Meetings } from "@/components/meetings"
import MessageAlert from "@/components/messageAlert"
import { APIsRequest } from "@/libs/requestAPIs/requestAPIs"
import { RequireAttention } from "@/components/required-attention"

export default function Dashboard() {
  const [jobs, setJobs] = useState<any>([]);
  const [applicants, setApplicants] = useState<any>([]);
  const [alertDetails, setAlertDetails] = useState<{ status: '' | 'error' | 'success'; message: string; id: any }>({ status: '', message: '', id: 0 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, applicantsRes] = await Promise.all([ APIsRequest.getJobsRequest(), APIsRequest.getApplicantsRequest() ]);
        const [jobsData, applicantsData] = await Promise.all([ jobsRes.json(), applicantsRes.json() ]);

        if (!jobsRes.ok) {
          setAlertDetails({ status: 'error', message: jobsData.error || 'Error', id: Date.now() });
        } else {
          setJobs(jobsData?.data);
        }

        if (!applicantsRes.ok) {
          setAlertDetails({ status: 'error', message: applicantsData.error || 'Error', id: Date.now() });
        } else {
          setApplicants(applicantsData?.data);
        }

      } catch (error: any) {
        console.error(error);
        setAlertDetails({ status: 'error', message: error?.message || error?.error || 'An error occurred', id: Date.now() });
      } finally {
        setTimeout(() => setAlertDetails({ status: '', message: '', id: '' }), 3000);
      }
    };

    fetchData();
  }, []);
  
  return (
    <>
      <Sidebar />
      <Navbar />

      <div className="min-h-screen bg-[#e5edf9] animate-fade-up animation-fill-forwards">
        <main className="ml-20 pt-16 px-4 py-6 mx-auto">
          <div className="flex flex-col xl:flex-row gap-6 mt-6">
            <div className="flex-1 min-w-0">
              {alertDetails.status && ( <MessageAlert status={alertDetails.status} message={alertDetails.message} id={alertDetails.id} /> )}
              <Overview />
              <RequireAttention jobs={jobs} applicants={applicants} />
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
