import { useEffect, useMemo, useState } from 'react'
import {
  getApplications,
  updateApplicationStatus,
  type PortalApplication,
} from '../../api/applications'
import { resolveFileUrl } from '../../config'
import ApplicantProfileModal from '../../components/applicants/ApplicantProfileModal'
import { User, FileText, UserCheck, ClipboardCheck, CalendarCheck } from 'lucide-react'
import '../shared/WorkPages.css'

const CompanyShortlistPage = () => {
  const [applications, setApplications] = useState<PortalApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedApp, setSelectedApp] = useState<PortalApplication | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    setLoading(true)
    getApplications()
      .then((data) => setApplications(data))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load shortlist queue')
      )
      .finally(() => setLoading(false))
  }, [])

  const queue = useMemo(
    () =>
      applications.filter((app) =>
        ['applied', 'eligible', 'shortlisted'].includes(app.status)
      ),
    [applications]
  )

  const setStatus = async (id: number, status: string) => {
    try {
      setUpdatingId(id)
      await updateApplicationStatus(id, status)
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      )
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Status update failed')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <section className="work-page">
      <article className="work-card">
        <h1>Shortlist Candidates</h1>
        <p>Move candidates from screening to shortlist and test rounds. View profiles to make informed decisions.</p>
      </article>
      <article className="work-card">
        {error && <p className="work-error">{error}</p>}
        {loading ? (
          <p className="work-muted">Loading shortlist queue...</p>
        ) : queue.length === 0 ? (
          <p className="work-muted">No candidates in shortlist queue.</p>
        ) : (
          <ul className="work-list">
            {queue.map((app) => {
              const resumeUrl = app.profile?.resumeUrl
                ? resolveFileUrl(app.profile.resumeUrl)
                : null

              return (
                <li key={app.id}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ margin: '0 0 0.2rem' }}>
                        {app.studentName || app.studentEmail} &mdash; {app.jobTitle}
                      </h3>
                      <p className="work-muted" style={{ fontSize: '0.82rem' }}>
                        Current status:{' '}
                        <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                          {app.status.replace(/_/g, ' ')}
                        </span>
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.4rem',
                        alignItems: 'center',
                      }}
                    >
                      <button
                        className="work-btn secondary"
                        onClick={() => setSelectedApp(app)}
                        title="View profile"
                      >
                        <User size={14} /> Profile
                      </button>

                      {resumeUrl && (
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="work-btn secondary"
                          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <FileText size={14} /> Resume
                        </a>
                      )}

                      <button
                        className="work-btn"
                        style={{ background: '#16a34a' }}
                        onClick={() => setStatus(app.id, 'shortlisted')}
                        disabled={updatingId === app.id || app.status === 'shortlisted'}
                      >
                        <UserCheck size={14} /> Shortlist
                      </button>
                      <button
                        className="work-btn secondary"
                        onClick={() => setStatus(app.id, 'test_scheduled')}
                        disabled={updatingId === app.id}
                      >
                        <ClipboardCheck size={14} /> Test
                      </button>
                      <button
                        className="work-btn secondary"
                        onClick={() => setStatus(app.id, 'interview_scheduled')}
                        disabled={updatingId === app.id}
                      >
                        <CalendarCheck size={14} /> Interview
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </article>

      {selectedApp && (
        <ApplicantProfileModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </section>
  )
}

export default CompanyShortlistPage
