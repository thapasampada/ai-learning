import nodemailer from 'nodemailer'

const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email is not configured. Set EMAIL_USER and EMAIL_PASS in backend/.env.')
    }

    const port = Number(process.env.SMTP_PORT || 587)
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error('SMTP_PORT must be a valid port number.')
    }

    const smtpHost = process.env.SMTP_HOST
    const service = process.env.EMAIL_SERVICE || 'gmail'
    const transportOptions = smtpHost
        ? {
            host: smtpHost,
            port,
            secure: process.env.SMTP_SECURE
                ? process.env.SMTP_SECURE.toLowerCase() === 'true'
                : port === 465,
        }
        : { service }

    const password = process.env.EMAIL_PASS.trim()

    return nodemailer.createTransport({
        ...transportOptions,
        auth: {
            user: process.env.EMAIL_USER.trim(),
            pass: !smtpHost && service.toLowerCase() === 'gmail'
                ? password.replace(/\s/g, '')
                : password,
        },
    })
}

const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export const sendPasswordResetEmail = async ({ email, resetUrl, username }) => {
    const transporter = createTransporter()
    const safeUsername = escapeHtml(username || 'there')
    const safeResetUrl = escapeHtml(resetUrl)

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
                <h2 style="color: #1d4ed8;">Password Reset</h2>
                <p>Hello ${safeUsername},</p>
                <p>We received a request to reset your password for your AI Study Assistant account.</p>
                <p>
                    <a href="${safeResetUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 18px; border-radius: 8px; text-decoration: none;">
                        Reset Password
                    </a>
                </p>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p>${safeResetUrl}</p>
                <p>This link will expire in 10 minutes.</p>
                <p>If you did not request this email, you can safely ignore it.</p>
            </div>
        `,
        text: `Hello ${username || 'there'},\n\nReset your AI Study Assistant password using this link: ${resetUrl}\n\nThis link expires in 10 minutes. If you did not request this email, you can ignore it.`,
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        const details = [error.code, error.responseCode, error.command, error.message]
            .filter(Boolean)
            .join(' - ')
        throw new Error(`Password reset email delivery failed${details ? `: ${details}` : '.'}`, { cause: error })
    }
}
