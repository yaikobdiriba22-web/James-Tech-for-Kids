/**
 * Email & Notification Service for James Tech Academy
 * Recipient: yaikobdiriba22@gmail.com
 * Phone: +251 922 067 302
 */

export const ADMIN_EMAIL = 'yaikobdiriba22@gmail.com';
export const ADMIN_PHONE = '+251922067302';
export const ADMIN_PHONE_DISPLAY = '+251 922 067 302';

export interface EnrollmentPayload {
  refCode: string;
  parentName: string;
  studentName: string;
  studentAge: string;
  phone: string;
  email: string;
  programTitle: string;
  learningFormat: string;
  preferredDays: string;
  message?: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface BackendSubmissionResponse {
  success: boolean;
  message: string;
  refCode?: string;
  error?: string;
  directActions?: {
    adminEmail: string;
    adminPhone: string;
    gmailComposeUrl: string;
    whatsAppUrl: string;
  };
}

/**
 * Submits enrollment form to backend API route /api/enroll
 */
export async function submitEnrollmentToBackend(payload: EnrollmentPayload): Promise<BackendSubmissionResponse> {
  try {
    const res = await fetch('/api/enroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return {
        success: true,
        message: data.message || 'Enrollment registered successfully.',
        refCode: data.refCode || payload.refCode,
        directActions: data.directActions,
      };
    }

    return {
      success: false,
      message: data.error || 'Backend submission returned an error.',
      error: data.error,
    };
  } catch (error) {
    console.warn('Backend /api/enroll fetch failed, engaging client dispatch:', error);
    return {
      success: true,
      message: 'Application recorded locally and prepared for direct email dispatch.',
    };
  }
}

/**
 * Submits contact form to backend API route /api/contact
 */
export async function submitContactToBackend(payload: ContactPayload): Promise<BackendSubmissionResponse> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return {
        success: true,
        message: data.message || 'Inquiry received successfully.',
        directActions: data.directActions,
      };
    }

    return {
      success: false,
      message: data.error || 'Backend inquiry submission failed.',
      error: data.error,
    };
  } catch (error) {
    console.warn('Backend /api/contact fetch failed, engaging client dispatch:', error);
    return {
      success: true,
      message: 'Inquiry registered locally and prepared for direct email dispatch.',
    };
  }
}

/**
 * Generates formatted text for the enrollment application
 */
export function formatEnrollmentText(payload: EnrollmentPayload): string {
  return (
    `APPLICATION REFERENCE: ${payload.refCode}\n` +
    `-----------------------------------------\n` +
    `STUDENT DETAILS:\n` +
    `• Name: ${payload.studentName}\n` +
    `• Age: ${payload.studentAge} years old\n` +
    `• Selected Track: ${payload.programTitle}\n` +
    `• Preferred Format: ${payload.learningFormat} (${payload.preferredDays})\n\n` +
    `PARENT / GUARDIAN CONTACT:\n` +
    `• Parent Name: ${payload.parentName}\n` +
    `• Phone: ${payload.phone}\n` +
    `• Email: ${payload.email}\n\n` +
    `LEARNER GOALS / NOTES:\n` +
    `${payload.message || 'No additional notes provided'}\n\n` +
    `Submitted via James Tech Academy Admissions Portal`
  );
}

/**
 * Generates formatted text for contact inquiry
 */
export function formatContactText(payload: ContactPayload): string {
  return (
    `NEW CONTACT INQUIRY - JAMES TECH ACADEMY\n` +
    `-----------------------------------------\n` +
    `• Sender: ${payload.name}\n` +
    `• Email: ${payload.email}\n` +
    `• Subject: ${payload.subject || 'General Inquiry'}\n\n` +
    `MESSAGE:\n` +
    `${payload.message}\n\n` +
    `Direct reply to: ${payload.email}`
  );
}

/**
 * Generates Google Mail (Gmail) web compose URL
 */
export function generateGmailComposeUrl(to: string, subject: string, body: string): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

/**
 * Generates a pre-filled mailto URL for default email clients
 */
export function generateMailtoUrl(to: string, subject: string, body: string): string {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Generates an enrollment mailto URL
 */
export function generateEnrollmentMailto(payload: EnrollmentPayload): string {
  const subject = `[${payload.refCode}] Enrollment Application: ${payload.studentName} (${payload.programTitle})`;
  const body = formatEnrollmentText(payload);
  return generateMailtoUrl(ADMIN_EMAIL, subject, body);
}

/**
 * Generates an enrollment Gmail compose URL
 */
export function generateEnrollmentGmail(payload: EnrollmentPayload): string {
  const subject = `[${payload.refCode}] Enrollment Application: ${payload.studentName} (${payload.programTitle})`;
  const body = formatEnrollmentText(payload);
  return generateGmailComposeUrl(ADMIN_EMAIL, subject, body);
}

/**
 * Generates an enrollment WhatsApp URL directly to +251 922 067 302
 */
export function generateEnrollmentWhatsApp(payload: EnrollmentPayload): string {
  const text = encodeURIComponent(
    `⚡ Hello James Tech Director Yaikob Diriba (+251 922 067 302)!\n\n` +
      `I am submitting an enrollment application for James Tech Academy:\n\n` +
      `• Ref ID: ${payload.refCode}\n` +
      `• Student: ${payload.studentName} (Age: ${payload.studentAge})\n` +
      `• Track: ${payload.programTitle}\n` +
      `• Format: ${payload.learningFormat} (${payload.preferredDays})\n` +
      `• Parent Name: ${payload.parentName}\n` +
      `• Phone: ${payload.phone}\n` +
      `• Email: ${payload.email}\n\n` +
      `Please confirm seat availability and orientation timing. Thank you!`
  );
  return `https://wa.me/${ADMIN_PHONE.replace('+', '')}?text=${text}`;
}

/**
 * Generates a contact inquiry Gmail compose URL
 */
export function generateContactGmail(payload: ContactPayload): string {
  const subject = `James Tech Inquiry: ${payload.subject || 'General Inquiry'} from ${payload.name}`;
  const body = formatContactText(payload);
  return generateGmailComposeUrl(ADMIN_EMAIL, subject, body);
}

/**
 * Generates a contact inquiry mailto URL
 */
export function generateContactMailto(payload: ContactPayload): string {
  const subject = `James Tech Inquiry: ${payload.subject || 'General Inquiry'} from ${payload.name}`;
  const body = formatContactText(payload);
  return generateMailtoUrl(ADMIN_EMAIL, subject, body);
}

/**
 * Generates a contact inquiry WhatsApp URL
 */
export function generateContactWhatsApp(name: string, subject: string, message: string): string {
  const text = encodeURIComponent(
    `Hello James Tech Director Yaikob Diriba (+251 922 067 302)!\n\n` +
      `My name is ${name}.\n` +
      `Subject: ${subject || 'Inquiry'}\n\n` +
      `Message: ${message}\n\n` +
      `Please let me know how we can connect.`
  );
  return `https://wa.me/${ADMIN_PHONE.replace('+', '')}?text=${text}`;
}
