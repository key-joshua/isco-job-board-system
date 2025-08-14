"use client"

import { JobDetails } from "@/components/job-details"

interface JobPageProps {
  params: {
    id: string
  }
}

export default function JobPage({ params }: JobPageProps) {
    return <JobDetails jobId={params.id}/>
}
