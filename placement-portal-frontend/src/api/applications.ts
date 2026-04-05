import { apiFetch } from './client'

export interface StudentApplication {
  id: number
  jobId: number
  status: string
  appliedAt: string
  jobTitle: string
  company: string
}

export interface ApplicantProject {
  title: string
  description?: string
  techStack?: string
  link?: string
  githubLink?: string
}

export interface ApplicantProfile {
  tenthPercentage: number | null
  twelfthPercentage: number | null
  backlogs: number | null
  graduationYear: number | null
  programmingLanguages: string | null
  frameworks: string | null
  tools: string | null
  certifications: string | null
  projects: ApplicantProject[]
  internshipExperience: string | null
  achievements: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  portfolioUrl: string | null
  resumeUrl: string | null
  resumeOriginalName: string | null
}

export interface PortalApplication {
  id: number
  jobId: number
  studentId: number
  status: string
  appliedAt: string
  jobTitle: string
  company: string
  studentName: string
  studentEmail: string
  studentPhone?: string
  enrollmentNumber?: string
  profileImage?: string
  profile?: ApplicantProfile | null
}

export interface CreateApplicationResponse {
  id: number
  jobId: number
  studentId: number
  status: string
}

export async function applyToJob(jobId: number): Promise<CreateApplicationResponse> {
  return apiFetch<CreateApplicationResponse>('/applications', {
    method: 'POST',
    body: JSON.stringify({ jobId }),
  })
}

export async function getMyApplications(): Promise<StudentApplication[]> {
  return apiFetch<StudentApplication[]>('/applications/my')
}

export async function getApplications(jobId?: number): Promise<PortalApplication[]> {
  const suffix = jobId ? `?jobId=${jobId}` : ''
  return apiFetch<PortalApplication[]>(`/applications${suffix}`)
}

export async function updateApplicationStatus(
  applicationId: number,
  status: string
): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/applications/${applicationId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}
