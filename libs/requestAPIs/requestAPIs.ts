import { getAuthSessions } from "../utils/utils";

export const APIsRequest = {
  signupRequest: async (deviceId: string, data: any) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('is_google', data.is_google);
    data?.file && formData.append('profile_picture', data.file);
    data?.password && formData.append('password', data.password);
    formData.append('username', `${data.lastname} ${data.firstname}`);

    const headers = { 'User-Device': deviceId };
    return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/signup`, { body: formData, method: 'POST', headers });
  },

  signinRequest: async (deviceId: string, data: any) => {
    const headers = { 'User-Device': deviceId, 'Content-Type': 'application/json' };
    return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/signin`, { body: JSON.stringify(data), method: 'POST', headers });
  },

  verifyAccountRequest: async (session: string) => {
    const headers = {'Content-Type': 'application/json' };
    return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/verify-email/${session}`, { method: 'GET' });
  },

  resetPasswordRequest: async (session: any, data: any) => {
    const headers = {'Content-Type': 'application/json' };
    return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/reset-password/${session}`, { body: JSON.stringify(data), method: 'PATCH', headers });
  },

  sendVerificationLinkRequest: async (deviceId: string, action: string, data: any) => {
    const headers = { 'User-Device': deviceId, 'Content-Type': 'application/json' };
    return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/send-verification-link/${action}`, { body: JSON.stringify(data), method: 'POST', headers });
  },

  signoutRequest: async (session: string, deviceId: string) => {
    const headers = { Authorization: `Bearer ${session}`, 'User-Device': deviceId, 'Content-Type': 'application/json' };
    return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/signout`, { method: 'DELETE', headers });
  },

  getJobsRequest: async ({ keyword }: { keyword?: string } = {}) => {
    const authSessions = getAuthSessions();
    const headers = { 'Authorization': `Bearer ${authSessions?.session?.access_token || ""}`, 'User-Device': authSessions?.device || "", 'Content-Type': 'application/json', };

    const params: Record<string, string> = {};
    if (keyword) params.keyword = keyword;

    const queryString = Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : '';
    return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/jobs/get-jobs${queryString}`, { method: 'GET', headers });
  },

  getJobRequest: async (id: string) => {
    const authSessions = getAuthSessions();
    const headers = { 'Authorization': `Bearer ${authSessions?.session?.access_token || ""}`, 'User-Device': authSessions?.device || "", 'Content-Type': 'application/json', };
    
    return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/jobs/get-job/${id}`, { method: 'GET', headers });
  },

  createJobRequest: async (data: any) => {
    const authSessions = getAuthSessions();
    const headers = { 'Authorization': `Bearer ${authSessions?.session?.access_token || ""}`, 'User-Device': authSessions?.device || "" };
    
    const formData = new FormData();

    if (data.title) formData.append('title', data.title);
    if (data.company) formData.append('company', data.company);
    if (data.location) formData.append('location', data.location);
    if (data.status) formData.append('status', data.status);
    if (data.attachment) formData.append('attachment', data.attachment);
    if (data.benefits) formData.append('benefits', data.benefits);
    if (data.contact_email) formData.append('contact_email', data.contact_email);
    if (data.deadline) formData.append('deadline', data.deadline);
    if (data.department) formData.append('department', data.department);
    if (data.description) formData.append('description', data.description);
    if (data.experience) formData.append('experience', data.experience);
    if (data.type) formData.append('type', data.type);
    if (data.salary) formData.append('salary', data.salary);
    if (data.requirements) formData.append('requirements', data.requirements);
    if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString());
    if (data.is_remote !== undefined) formData.append('is_remote', data.is_remote.toString());
    if (data.is_urgent !== undefined) formData.append('is_urgent', data.is_urgent.toString());
    if (data.available_positions !== undefined) formData.append('available_positions', data.available_positions.toString());

    return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/jobs/create-job`, { body: formData, method: 'POST', headers });
  },

  updateJobRequest: async (data: any, id: string) => {
    const authSessions = getAuthSessions();
    const headers = { 'Authorization': `Bearer ${authSessions?.session?.access_token || ""}`, 'User-Device': authSessions?.device || "" };
    
    const formData = new FormData();

    if (data.title) formData.append('title', data.title);
    if (data.company) formData.append('company', data.company);
    if (data.location) formData.append('location', data.location);
    if (data.status) formData.append('status', data.status);
    if (data.attachment) formData.append('attachment', data.attachment);
    if (data.benefits) formData.append('benefits', data.benefits);
    if (data.contact_email) formData.append('contact_email', data.contact_email);
    if (data.deadline) formData.append('deadline', data.deadline);
    if (data.department) formData.append('department', data.department);
    if (data.description) formData.append('description', data.description);
    if (data.experience) formData.append('experience', data.experience);
    if (data.type) formData.append('type', data.type);
    if (data.salary) formData.append('salary', data.salary);
    if (data.requirements) formData.append('requirements', data.requirements);
    if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString());
    if (data.is_remote !== undefined) formData.append('is_remote', data.is_remote.toString());
    if (data.is_urgent !== undefined) formData.append('is_urgent', data.is_urgent.toString());
    if (data.available_positions !== undefined) formData.append('available_positions', data.available_positions.toString());

    return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/jobs/update-job/${id}`, { body: formData, method: 'PATCH', headers });
  },

  deleteJobRequest: async (id: string) => {
    const authSessions = getAuthSessions();
    const headers = { 'Authorization': `Bearer ${authSessions?.session?.access_token || ""}`, 'User-Device': authSessions?.device || "", 'Content-Type': 'application/json', };

    return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/jobs/delete-job/${id}`, { method: 'DELETE', headers });
  },
  
  getApplicantsRequest: async ({ keyword }: { keyword?: string } = {}) => {
    const authSessions = getAuthSessions();
    const headers = { 'Authorization': `Bearer ${authSessions?.session?.access_token || ""}`, 'User-Device': authSessions?.device || "", 'Content-Type': 'application/json', };

    const params: Record<string, string> = {};
    if (keyword) params.keyword = keyword;

    const queryString = Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : '';
    return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/applicants/get-applicants${queryString}`, { method: 'GET', headers });
  },

  createApplicantRequest: async (data: any, jobId: string) => {
    const authSessions = getAuthSessions();
    const headers = { 'Authorization': `Bearer ${authSessions?.session?.access_token || ""}`, 'User-Device': authSessions?.device || "" };
    
    const formData = new FormData();

    if(jobId) formData.append('job_id', jobId);
    if (data.full_name) formData.append('full_name', data.full_name);
    if (data.email) formData.append('email', data.email);
    if (data.message) formData.append('message', data.message);
    if (data.cover_letter_file) formData.append('cover_letter', data.cover_letter_file);
    if (data.resume_file) formData.append('resume', data.resume_file);

    return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/applicants/create-applicant`, { body: formData, method: 'POST', headers });
  },

  updateApplicantRequest: async (data: any, id: string) => {
    const authSessions = getAuthSessions();
    const headers = { 'Authorization': `Bearer ${authSessions?.session?.access_token || ""}`, 'User-Device': authSessions?.device || "", 'Content-Type': 'application/json' };
    
    const formData = new FormData();
    if (data.status) formData.append('status', data.status);

    return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/applicants/update-applicant/${id}`, {  body: JSON.stringify(data), method: 'PATCH', headers });
  },

  deleteApplicantRequest: async (id: string) => {
    const authSessions = getAuthSessions();
    const headers = { 'Authorization': `Bearer ${authSessions?.session?.access_token || ""}`, 'User-Device': authSessions?.device || "", 'Content-Type': 'application/json' };

    return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/applicants/delete-applicant/${id}`, { method: 'DELETE', headers })
  },
};
