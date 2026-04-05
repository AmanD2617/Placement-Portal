import { useEffect, useMemo, useState } from 'react'
import {
  getApplications,
  updateApplicationStatus,
  type PortalApplication,
} from '../../api/applications'
import { resolveFileUrl } from '../../config'
import ApplicantProfileModal from '../../components/applicants/ApplicantProfileModal'
import {
  User,
  FileText,
  XCircle,
  Search,
  UserCheck,
} from 'lucide-react'
import '../shared/WorkPages.css'

const STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied' },
  { value: 'eligible', label: 'Eligible' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'test_scheduled', label: 'Test Scheduled' },
  { value: 'interview_scheduled', label: 'Interview' },
  { value: 'selected', label: 'Selected' },
  { value: 'rejected', label: 'Rejected' },
]

const statusColor = (s: string): string => {
  switch (s) {
    case 'shortlisted':
    case 'selected':
      return '#16a34a'
    case 'rejected':
      return '#dc2626'
    case 'eligible':
      return '#2563eb'
    case 'test_scheduled':
    case 'interview_scheduled':
      return '#d97706'
    default:
      return '#6b7280'
  }
}

const TpoMonitorApplicationsPage = () => {
  const [applications, setApplications] = useState<PortalApplication[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedApp, setSelectedApp] = useState<PortalApplication | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    getApplications()
      .then((data) => setApplications(data))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load applications')
      )
      .finally(() => setLoading(false))
  }, [])

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

  const filtered = useMemo(() => {
    let list = applications
    if (statusFilter !== 'all') {
      list = list.filter((item) => item.status === statusFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (a) =>
          (a.studentName || '').toLowerCase().includes(q) ||
          (a.studentEmail || '').toLowerCase().includes(q) ||
          (a.enrollmentNumber || '').toLowerCase().includes(q) ||
          (a.jobTitle || '').toLowerCase().includes(q) ||
          (a.company || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [applications, statusFilter, searchQuery])

  return (
    <section className="work-page">
      <article className="work-card">
        <h1>Monitor Applications</h1>
        <p>Track application movement across all drives. View student profiles and resumes.</p>
      </article>

      {/* Filters */}
      <article className="work-card">
        <div className="work-row" style={{ gap: '0.6rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '0.6rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
              }}
            />
            <input
              type="text"
              placeholder="Search by name, email, company, job..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.6rem 0.5rem 2rem',
                border: '1px solid var(--jims-border, #e5e7eb)',
                borderRadius: '0.55rem',
                fontSize: '0.85rem',
              }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.6rem',
              border: '1px solid var(--jims-border, #e5e7eb)',
              borderRadius: '0.55rem',
              fontSize: '0.85rem',
              minWidth: 140,
            }}
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </article>

      {/* Application List */}
      <article className="work-card">
        {error && <p className="work-error">{error}</p>}
        {loading ? (
          <p className="work-muted">Loading applications...</p>
        ) : filtered.length === 0 ? (
          <p className="work-muted">
            {applications.length === 0
              ? 'No applications recorded yet.'
              : 'No records match your filters.'}
          </p>
        ) : (
          <>
            <p className="work-muted" style={{ marginBottom: '0.6rem', fontSize: '0.82rem' }}>
              Showing {filtered.length} of {applications.length} application
              {applications.length !== 1 ? 's' : ''}
            </p>
            <ul className="work-list">
              {filtered.map((app) => {
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
                      {/* Left info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ margin: '0 0 0.2rem' }}>
                          {app.jobTitle} &mdash; {app.company}
                        </h3>
                        <p className="work-muted" style={{ fontSize: '0.82rem' }}>
                          {app.studentName || app.studentEmail}
                          {app.enrollmentNumber && <> &middot; #{app.enrollmentNumber}</>}
                        </p>
                        <span
                          style={{
                            display: 'inline-block',
                            marginTop: '0.3rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: statusColor(app.status),
                            background: `${statusColor(app.status)}12`,
                            border: `1px solid ${statusColor(app.status)}30`,
                            borderRadius: '999px',
                            padding: '0.1rem 0.55rem',
                            textTransform: 'capitalize',
                          }}
                        >
                          {app.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Right actions */}
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.4rem',
                          alignItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <button
                          className="work-btn secondary"
                          onClick={() => setSelectedApp(app)}
                          title="View full profile"
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

                        {app.status !== 'shortlisted' && app.status !== 'selected' && (
                          <button
                            className="work-btn"
                            style={{ background: '#16a34a' }}
                            onClick={() => setStatus(app.id, 'shortlisted')}
                            disabled={updatingId === app.id}
                          >
                            <UserCheck size={14} />{' '}
                            {updatingId === app.id ? '...' : 'Shortlist'}
                          </button>
                        )}

                        {app.status !== 'rejected' && (
                          <button
                            className="work-btn danger"
                            onClick={() => setStatus(app.id, 'rejected')}
                            disabled={updatingId === app.id}
                          >
                            <XCircle size={14} />{' '}
                            {updatingId === app.id ? '...' : 'Reject'}
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </article>

      {/* Profile Modal */}
      {selectedApp && (
        <ApplicantProfileModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </section>
  )
}

export default TpoMonitorApplicationsPage
