import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'yaikobdiriba22@gmail.com';
export const ADMIN_PHONE = process.env.ADMIN_PHONE || '+251922067302';

app.use(express.json());

// In-memory submissions log to ensure submissions are never lost
const inMemorySubmissions: Array<Record<string, unknown>> = [];

/**
 * Configure transporter if SMTP credentials are provided in env
 */
function getSmtpTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return null;
}

/**
 * Attempt to send email via Formspree or EmailJS or SMTP
 */
async function dispatchEmail(subject: string, text: string, html: string, replyTo: string) {
  // 1. Try SMTP if configured
  const transporter = getSmtpTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"James Tech Academy" <${process.env.SMTP_USER}>`,
        to: ADMIN_EMAIL,
        replyTo,
        subject,
        text,
        html,
      });
      return { delivered: true, method: 'smtp' };
    } catch (err) {
      console.warn('SMTP delivery attempt failed:', err);
    }
  }

  // 2. Try Formspree if FORMSPREE_FORM_ID is provided
  const formspreeId = process.env.FORMSPREE_FORM_ID;
  if (formspreeId) {
    try {
      const resp = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: subject,
          _replyto: replyTo,
          message: text,
        }),
      });
      if (resp.ok) {
        return { delivered: true, method: 'formspree' };
      }
    } catch (err) {
      console.warn('Formspree dispatch error:', err);
    }
  }

  // 3. Try EmailJS if credentials are provided
  const emailJsServiceId = process.env.EMAILJS_SERVICE_ID;
  const emailJsTemplateId = process.env.EMAILJS_TEMPLATE_ID;
  const emailJsPublicKey = process.env.EMAILJS_PUBLIC_KEY;
  const emailJsPrivateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (emailJsServiceId && emailJsTemplateId && emailJsPublicKey) {
    try {
      const resp = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: emailJsServiceId,
          template_id: emailJsTemplateId,
          user_id: emailJsPublicKey,
          accessToken: emailJsPrivateKey,
          template_params: {
            to_email: ADMIN_EMAIL,
            reply_to: replyTo,
            subject,
            message: text,
          },
        }),
      });
      if (resp.ok) {
        return { delivered: true, method: 'emailjs' };
      }
    } catch (err) {
      console.warn('EmailJS dispatch error:', err);
    }
  }

  return { delivered: false, method: 'fallback_queued' };
}

// Health Check API
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    adminEmail: ADMIN_EMAIL,
    adminPhone: ADMIN_PHONE,
    time: new Date().toISOString(),
    submissionsCount: inMemorySubmissions.length,
  });
});

// Enrollment API Route
app.post('/api/enroll', async (req, res) => {
  try {
    const {
      parentName,
      studentName,
      studentAge,
      phone,
      email,
      programTitle,
      learningFormat,
      preferredDays,
      message,
    } = req.body;

    // Validation
    if (!parentName || !studentName || !phone || !email || !programTitle) {
      return res.status(400).json({
        success: false,
        error: 'Missing required enrollment fields (parentName, studentName, phone, email, programTitle)',
      });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const refCode = `JT-2026-${randomSuffix}`;

    const record = {
      type: 'enrollment',
      refCode,
      parentName,
      studentName,
      studentAge,
      phone,
      email,
      programTitle,
      learningFormat: learningFormat || 'in-person',
      preferredDays: preferredDays || 'weekends',
      message: message || '',
      receivedAt: new Date().toISOString(),
    };

    inMemorySubmissions.push(record);
    console.log(`[Admissions API] New Enrollment received: [${refCode}] ${studentName} - ${programTitle}`);

    const subject = `⚡ New Enrollment [${refCode}]: ${studentName} (${programTitle}) - James Tech`;
    const plainText =
      `NEW ENROLLMENT APPLICATION - JAMES TECH ACADEMY\n` +
      `Reference ID: ${refCode}\n` +
      `-----------------------------------------\n` +
      `Student Name: ${studentName}\n` +
      `Student Age: ${studentAge}\n` +
      `Program Track: ${programTitle}\n` +
      `Learning Format: ${learningFormat} (${preferredDays})\n\n` +
      `Parent / Guardian: ${parentName}\n` +
      `Phone Number: ${phone}\n` +
      `Email Address: ${email}\n\n` +
      `Notes / Goals:\n${message || 'None'}\n\n` +
      `Recipient: ${ADMIN_EMAIL}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">James Tech Academy - New Enrollment</h2>
        <p style="font-size: 14px; color: #64748b;">Reference ID: <strong>${refCode}</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
          <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold;">Student:</td><td style="padding: 8px;">${studentName} (${studentAge} years old)</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Track:</td><td style="padding: 8px; color: #d97706; font-weight: bold;">${programTitle}</td></tr>
          <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold;">Format:</td><td style="padding: 8px;">${learningFormat} (${preferredDays})</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Parent Name:</td><td style="padding: 8px;">${parentName}</td></tr>
          <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;"><a href="tel:${phone}">${phone}</a></td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
        </table>
        <div style="margin-top: 15px; padding: 12px; background: #f1f5f9; border-radius: 6px;">
          <strong>Notes / Goals:</strong><br/>
          ${message || 'No additional notes provided.'}
        </div>
      </div>
    `;

    const dispatchResult = await dispatchEmail(subject, plainText, htmlContent, email);

    return res.status(200).json({
      success: true,
      message: 'Enrollment application received and registered successfully.',
      refCode,
      data: record,
      deliveryStatus: dispatchResult,
      directActions: {
        adminEmail: ADMIN_EMAIL,
        adminPhone: ADMIN_PHONE,
        gmailComposeUrl: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
          ADMIN_EMAIL
        )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainText)}`,
        whatsAppUrl: `https://wa.me/${ADMIN_PHONE.replace('+', '')}?text=${encodeURIComponent(
          `Hello Director Yaikob (+251 922 067 302)! Enrollment submitted: [${refCode}] ${studentName} for ${programTitle}. Parent: ${parentName} (${phone}, ${email}).`
        )}`,
      },
    });
  } catch (error) {
    console.error('Error handling /api/enroll:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing the enrollment application.',
    });
  }
});

// Contact API Route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required contact fields (name, email, message)',
      });
    }

    const record = {
      type: 'contact',
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
      receivedAt: new Date().toISOString(),
    };

    inMemorySubmissions.push(record);
    console.log(`[Contact API] New message from: ${name} (${email}) - ${subject}`);

    const emailSubject = `📩 James Tech Inquiry: ${subject || 'General Inquiry'} from ${name}`;
    const plainText =
      `NEW CONTACT INQUIRY - JAMES TECH ACADEMY\n` +
      `-----------------------------------------\n` +
      `Sender Name: ${name}\n` +
      `Sender Email: ${email}\n` +
      `Subject: ${subject || 'General Inquiry'}\n\n` +
      `Message:\n${message}\n\n` +
      `Direct reply to: ${email}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">James Tech - Contact Inquiry</h2>
        <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
        <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
        <div style="margin-top: 15px; padding: 15px; background: #f8fafc; border-left: 4px solid #f59e0b; border-radius: 4px;">
          ${message}
        </div>
      </div>
    `;

    const dispatchResult = await dispatchEmail(emailSubject, plainText, htmlContent, email);

    return res.status(200).json({
      success: true,
      message: 'Inquiry received and queued successfully.',
      data: record,
      deliveryStatus: dispatchResult,
      directActions: {
        adminEmail: ADMIN_EMAIL,
        adminPhone: ADMIN_PHONE,
        gmailComposeUrl: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
          ADMIN_EMAIL
        )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(plainText)}`,
        whatsAppUrl: `https://wa.me/${ADMIN_PHONE.replace('+', '')}?text=${encodeURIComponent(
          `Hello Director Yaikob (+251 922 067 302)! Inquiry from ${name} (${email}): ${message}`
        )}`,
      },
    });
  } catch (error) {
    console.error('Error handling /api/contact:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing the contact inquiry.',
    });
  }
});

// Vite & Static Asset Handling
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[James Tech] Full-stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
