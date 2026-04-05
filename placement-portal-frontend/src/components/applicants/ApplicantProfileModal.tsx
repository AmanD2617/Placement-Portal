import { useEffect } from 'react'
import type { PortalApplication } from '../../api/applications'
import { resolveFileUrl } from '../../config'
import {
  X,
  Mail,
  Phone,
  Hash,
  FileText,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  UserCircle,
} from 'lucide-react'
import './ApplicantProfileModal.css'

interface Props {
  application: PortalApplication
  onClose: () => void
}

const ApplicantProfileModal = ({ application, onClose }: Props) => {
  const { studentName, studentEmail, studentPhone, enrollmentNumber, profileImage, profile } =
    application

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Close when clicking overlay background
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  const initials = (() => {
    if (!studentName) return '?'
    const parts = studentName.trim().split(/\s+/)
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  })()

  const imageUrl = resolveFileUrl(profileImage ?? null)
  const resumeUrl = profile?.resumeUrl ? resolveFileUrl(profile.resumeUrl) : null

  const renderSkillGroup = (label: string, value: string | null | undefined) => {
    if (!value) return null
    const tags = value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    if (tags.length === 0) return null
    return (
      <div>
        <span className="apm-skill-label">{label}</span>
        <div className="apm-skills-row">
          {tags.map((tag, i) => (
            <span key={i} className="apm-skill-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="apm-overlay" onClick={handleOverlayClick}>
      <div className="apm-modal" role="dialog" aria-label="Applicant Profile">
        {/* ── Header ── */}
        <div className="apm-header">
          <div className="apm-header-left">
            {imageUrl ? (
              <img src={imageUrl} alt={studentName || 'Student'} className="apm-avatar" />
            ) : (
              <div className="apm-avatar-placeholder">{initials}</div>
            )}
            <div className="apm-header-info">
              <h2>{studentName || 'Unknown Student'}</h2>
              <p>
                {application.jobTitle} &middot; {application.company}
              </p>
            </div>
          </div>
          <button className="apm-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="apm-body">
          {/* Contact chips */}
          <div className="apm-contact-row">
            {studentEmail && (
              <span className="apm-contact-chip">
                <Mail size={13} /> {studentEmail}
              </span>
            )}
            {studentPhone && (
              <span className="apm-contact-chip">
                <Phone size={13} /> {studentPhone}
              </span>
            )}
            {enrollmentNumber && (
              <span className="apm-contact-chip">
                <Hash size={13} /> {enrollmentNumber}
              </span>
            )}
          </div>

          {!profile ? (
            <div className="apm-no-profile">
              <UserCircle size={48} strokeWidth={1} />
              <p>This student has not completed their profile yet.</p>
            </div>
          ) : (
            <>
              {/* Academic Info */}
              <div className="apm-section">
                <h3 className="apm-section-title">Academic Information</h3>
                <div className="apm-section-body">
                  <div className="apm-info-grid">
                    <div className="apm-info-item">
                      <span className="apm-info-label">10th %</span>
                      <span className={`apm-info-value ${profile.tenthPercentage == null ? 'apm-info-empty' : ''}`}>
                        {profile.tenthPercentage != null ? `${profile.tenthPercentage}%` : 'N/A'}
                      </span>
                    </div>
                    <div className="apm-info-item">
                      <span className="apm-info-label">12th %</span>
                      <span className={`apm-info-value ${profile.twelfthPercentage == null ? 'apm-info-empty' : ''}`}>
                        {profile.twelfthPercentage != null ? `${profile.twelfthPercentage}%` : 'N/A'}
                      </span>
                    </div>
                    <div className="apm-info-item">
                      <span className="apm-info-label">Backlogs</span>
                      <span className="apm-info-value">{profile.backlogs ?? 0}</span>
                    </div>
                    <div className="apm-info-item">
                      <span className="apm-info-label">Grad Year</span>
                      <span className={`apm-info-value ${profile.graduationYear == null ? 'apm-info-empty' : ''}`}>
                        {profile.graduationYear ?? 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {(profile.programmingLanguages || profile.frameworks || profile.tools || profile.certifications) && (
                <div className="apm-section">
                  <h3 className="apm-section-title">Skills & Technologies</h3>
                  <div className="apm-section-body">
                    {renderSkillGroup('Languages', profile.programmingLanguages)}
                    {renderSkillGroup('Frameworks', profile.frameworks)}
                    {renderSkillGroup('Tools', profile.tools)}
                    {renderSkillGroup('Certifications', profile.certifications)}
                  </div>
                </div>
              )}

              {/* Projects */}
              {profile.projects && profile.projects.length > 0 && (
                <div className="apm-section">
                  <h3 className="apm-section-title">Projects ({profile.projects.length})</h3>
                  <div className="apm-section-body">
                    {profile.projects.map((project, idx) => {
                      const link = project.link || project.githubLink || ''
                      return (
                        <div key={idx} className="apm-project-card">
                          <h4 className="apm-project-title">{project.title || 'Untitled'}</h4>
                          {project.description && (
                            <p className="apm-project-desc">{project.description}</p>
                          )}
                          {project.techStack && (
                            <div className="apm-project-tech">
                              {project.techStack.split(',').map((t, i) => (
                                <span key={i} className="apm-project-tech-tag">
                                  {t.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                          {link && (
                            <a
                              href={link}
                              target="_blank"
                              rel="noreferrer"
                              className="apm-project-link"
                            >
                              <ExternalLink size={12} /> {link.replace(/^https?:\/\//, '').slice(0, 50)}
                            </a>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Experience & Achievements */}
              {(profile.internshipExperience || profile.achievements) && (
                <div className="apm-section">
                  <h3 className="apm-section-title">Experience & Achievements</h3>
                  <div className="apm-section-body">
                    {profile.internshipExperience && (
                      <div style={{ marginBottom: profile.achievements ? '0.75rem' : 0 }}>
                        <span className="apm-skill-label">Internship Experience</span>
                        <p className="apm-text-block">{profile.internshipExperience}</p>
                      </div>
                    )}
                    {profile.achievements && (
                      <div>
                        <span className="apm-skill-label">Achievements</span>
                        <p className="apm-text-block">{profile.achievements}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* External Links */}
              {(profile.githubUrl || profile.linkedinUrl || profile.portfolioUrl) && (
                <div className="apm-section">
                  <h3 className="apm-section-title">External Links</h3>
                  <div className="apm-section-body">
                    <div className="apm-links-row">
                      {profile.githubUrl && (
                        <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="apm-ext-link">
                          <Github size={14} /> GitHub
                        </a>
                      )}
                      {profile.linkedinUrl && (
                        <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="apm-ext-link">
                          <Linkedin size={14} /> LinkedIn
                        </a>
                      )}
                      {profile.portfolioUrl && (
                        <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="apm-ext-link">
                          <Globe size={14} /> Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="apm-footer">
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="apm-resume-btn"
            >
              <FileText size={15} /> View Resume
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplicantProfileModal
