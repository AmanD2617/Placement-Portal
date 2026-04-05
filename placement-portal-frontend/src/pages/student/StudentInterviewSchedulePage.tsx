import { useEffect, useState } from 'react'
import { getMyRoundProgress, type StudentApplicationProgress } from '../../api/rounds'
import {
  CheckCircle,
  Clock,
  Lock,
  XCircle,
  Building2,
  ChevronDown,
  ChevronUp,
  CalendarDays,
} from 'lucide-react'
import '../shared/WorkPages.css'
import './InterviewTimeline.css'

const StudentInterviewSchedulePage = () => {
  const [data, setData] = useState<StudentApplicationProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    getMyRoundProgress()
      .then((result) => {
        setData(result)
        // Auto-expand the first application that has rounds
        const first = result.find((a) => a.rounds.length > 0)
        if (first) setExpandedId(first.applicationId)
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load interview schedule')
      )
      .finally(() => setLoading(false))
  }, [])

  const toggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  // Categorize applications
  const withRounds = data.filter((a) => a.rounds.length > 0)
  const withoutRounds = data.filter((a) => a.rounds.length === 0)

  return (
    <section className="work-page">
      <article className="work-card">
        <h1>Interview Schedule</h1>
        <p>Track your progress through each round of the selection process for every company you've applied to.</p>
      </article>

      {error && (
        <article className="work-card">
          <p className="work-error">{error}</p>
        </article>
      )}

      {loading ? (
        <article className="work-card">
          <p className="work-muted">Loading your interview schedule...</p>
        </article>
      ) : data.length === 0 ? (
        <article className="work-card">
          <p className="work-muted">You haven't applied to any jobs yet. Apply to jobs to see your interview schedule here.</p>
        </article>
      ) : (
        <>
          {/* Applications WITH rounds */}
          {withRounds.length > 0 && (
            <>
              {withRounds.map((app) => {
                const isExpanded = expandedId === app.applicationId
                const isRejected = app.applicationStatus === 'rejected'
                const isSelected = app.applicationStatus === 'selected'

                return (
                  <article key={app.applicationId} className="work-card itl-app-card">
                    {/* App header — clickable */}
                    <div className="itl-app-header" onClick={() => toggle(app.applicationId)}>
                      <div className="itl-app-info">
                        <Building2 size={18} className="itl-app-icon" />
                        <div>
                          <h3 className="itl-app-title">{app.jobTitle}</h3>
                          <p className="itl-app-company">{app.company}</p>
                        </div>
                      </div>
                      <div className="itl-app-right">
                        <span
                          className="itl-app-badge"
                          data-status={
                            isSelected ? 'selected' : isRejected ? 'rejected' : 'active'
                          }
                        >
                          {isSelected
                            ? 'Selected'
                            : isRejected
                            ? 'Rejected'
                            : 'In Progress'}
                        </span>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>

                    {/* Timeline */}
                    {isExpanded && (
                      <div className="itl-timeline">
                        {app.rounds.map((round, idx) => {
                          const isLast = idx === app.rounds.length - 1
                          let stepStatus: 'cleared' | 'current' | 'rejected' | 'locked'

                          if (round.candidateStatus === 'cleared') {
                            stepStatus = 'cleared'
                          } else if (round.candidateStatus === 'rejected') {
                            stepStatus = 'rejected'
                          } else if (round.candidateStatus === 'pending') {
                            stepStatus = 'current'
                          } else {
                            stepStatus = 'locked'
                          }

                          return (
                            <div key={round.id} className={`itl-step itl-step--${stepStatus}`}>
                              {/* Connector line */}
                              {!isLast && <div className="itl-connector" />}

                              {/* Icon */}
                              <div className="itl-step-icon">
                                {stepStatus === 'cleared' && <CheckCircle size={20} />}
                                {stepStatus === 'current' && <Clock size={20} />}
                                {stepStatus === 'rejected' && <XCircle size={20} />}
                                {stepStatus === 'locked' && <Lock size={16} />}
                              </div>

                              {/* Content */}
                              <div className="itl-step-content">
                                <div className="itl-step-header">
                                  <span className="itl-step-title">{round.title}</span>
                                  <span className="itl-step-status">
                                    {stepStatus === 'cleared' && 'Cleared'}
                                    {stepStatus === 'current' && 'Current Round'}
                                    {stepStatus === 'rejected' && 'Not Cleared'}
                                    {stepStatus === 'locked' && 'Upcoming'}
                                  </span>
                                </div>
                                {(round.date || round.description) && (
                                  <div className="itl-step-meta">
                                    {round.date && (
                                      <span className="itl-step-date">
                                        <CalendarDays size={12} />
                                        {new Date(round.date).toLocaleDateString('en-IN', {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })}
                                      </span>
                                    )}
                                    {round.description && (
                                      <span className="itl-step-desc">{round.description}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </article>
                )
              })}
            </>
          )}

          {/* Applications WITHOUT rounds */}
          {withoutRounds.length > 0 && (
            <article className="work-card">
              <h2 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Awaiting Rounds</h2>
              <p className="work-muted" style={{ marginBottom: '0.5rem', fontSize: '0.82rem' }}>
                These applications don't have interview rounds set up yet.
              </p>
              <ul className="work-list">
                {withoutRounds.map((app) => (
                  <li key={app.applicationId}>
                    <h3 style={{ margin: '0 0 0.15rem' }}>
                      {app.jobTitle} — {app.company}
                    </h3>
                    <p className="work-muted" style={{ fontSize: '0.82rem' }}>
                      Applied{' '}
                      {new Date(app.appliedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      {' '}&middot; Status:{' '}
                      <span style={{ textTransform: 'capitalize' }}>
                        {app.applicationStatus.replace(/_/g, ' ')}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          )}
        </>
      )}
    </section>
  )
}

export default StudentInterviewSchedulePage
