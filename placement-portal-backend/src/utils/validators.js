// ═══════════ Shared Validation Rules ═══════════
// Used by both registration and any future validation needs.

/** College email: firstname_lastname_mcaYY@jimsipu.org or @jimsindia.org */
export const COLLEGE_EMAIL_REGEX = /^[a-z]+_[a-z]+_mca\d{2}@(jimsipu\.org|jimsindia\.org)$/

/** Strong password: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special */
export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/

/** Phone: exactly 10 digits */
export const PHONE_REGEX = /^\d{10}$/

/** Enrollment number: exactly 11 digits (studentID + 3-digit college code + 2-digit year) */
export const ENROLLMENT_REGEX = /^\d{11}$/

/**
 * Validates registration input. Returns an error message string if invalid, or null if valid.
 */
export function validateRegistration({ email, password, role, name, phone, enrollmentNumber }) {
  // Required fields
  if (!email || !password || !role) {
    return 'Email, password, and role are required'
  }

  // Name: minimum 3 characters
  if (!name || name.trim().length < 3) {
    return 'Full name must be at least 3 characters'
  }

  // Email: must match college format for students
  if (role === 'student') {
    if (!COLLEGE_EMAIL_REGEX.test(email.toLowerCase())) {
      return 'Student email must follow the format: firstname_lastname_mcaYY@jimsipu.org'
    }
  } else {
    // Non-students: basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address'
    }
  }

  // Password: strong
  if (!STRONG_PASSWORD_REGEX.test(password)) {
    return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
  }

  // Phone: required and must be 10 digits
  if (!phone) {
    return 'Phone number is required'
  }
  if (!PHONE_REGEX.test(phone.replace(/\D/g, ''))) {
    return 'Phone number must be exactly 10 digits'
  }

  // Enrollment number: required for students only
  if (role === 'student') {
    if (!enrollmentNumber) {
      return 'Enrollment number is required for students'
    }
    if (!ENROLLMENT_REGEX.test(enrollmentNumber)) {
      return 'Enrollment number must be exactly 11 digits'
    }
  }

  return null // Valid
}
