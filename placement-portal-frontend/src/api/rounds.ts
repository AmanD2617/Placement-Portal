import { apiFetch } from './client'

// ═══════════ Types ═══════════

export interface Round {
  id: number
  jobId: number
  title: string
  order: number
  date: string | null
  description: string | null
  candidateCount?: number
}

export interface RoundCandidate {
  id: number
  status: 'pending' | 'cleared' | 'rejected'
  updatedAt: string
  studentId: number
  studentName: string | null
  studentEmail: string
  studentPhone: string | null
  enrollmentNumber: string | null
  profileImage: string | null
  resumeUrl: string | null
  skills: string
}

export interface RoundWithCandidates {
  round: { id: number; job_id: number; title: string; sort_order: number }
  candidates: RoundCandidate[]
}

export interface StudentRoundProgress {
  id: number
  title: string
  order: number
  date: string | null
  description: string | null
  candidateStatus: 'pending' | 'cleared' | 'rejected' | null
}

export interface StudentApplicationProgress {
  applicationId: number
  jobId: number
  jobTitle: string
  company: string
  applicationStatus: string
  currentRoundId: number | null
  appliedAt: string
  rounds: StudentRoundProgress[]
}

// ═══════════ API calls ═══════════

export async function getRounds(jobId: number): Promise<Round[]> {
  return apiFetch<Round[]>(`/rounds?jobId=${jobId}`)
}

export async function createRound(data: {
  jobId: number
  title: string
  order?: number
  date?: string
  description?: string
}): Promise<Round> {
  return apiFetch<Round>('/rounds', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateRound(
  roundId: number,
  data: { title?: string; order?: number; date?: string | null; description?: string }
): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/rounds/${roundId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteRound(roundId: number): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/rounds/${roundId}`, { method: 'DELETE' })
}

export async function getRoundCandidates(roundId: number): Promise<RoundWithCandidates> {
  return apiFetch<RoundWithCandidates>(`/rounds/${roundId}/candidates`)
}

export async function seedRound(roundId: number): Promise<{ ok: boolean; added: number; total: number }> {
  return apiFetch<{ ok: boolean; added: number; total: number }>(`/rounds/${roundId}/seed`, {
    method: 'POST',
  })
}

export async function updateCandidateStatus(
  roundId: number,
  candidateId: number,
  status: 'cleared' | 'rejected' | 'pending'
): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/rounds/${roundId}/candidates/${candidateId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export async function getMyRoundProgress(): Promise<StudentApplicationProgress[]> {
  return apiFetch<StudentApplicationProgress[]>('/rounds/my-progress')
}
