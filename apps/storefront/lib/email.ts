import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? "FurniTrack <noreply@furnitrack.app>"

export async function sendPasswordResetOtp(params: {
  to: string
  name: string
  otp: string
}) {
  const { to, name, otp } = params

  // In development/testing without a verified domain, Resend only allows
  // sending to the account owner's email. For testing, we can override this.
  const recipient = process.env.NODE_ENV === "production" ? to : (process.env.RESEND_TEST_EMAIL ?? to)

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f8f6; margin: 0; padding: 40px 16px;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; border: 1px solid #e5e7eb;">
        <h1 style="font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0 0 8px;">Reset your password</h1>
        <p style="color: #6a7282; font-size: 14px; margin: 0 0 32px;">Hi ${name}, use the code below to reset your FurniTrack password. It expires in <strong>15 minutes</strong>.</p>
        
        <div style="background: #f0f4ff; border: 2px dashed #c7d2fe; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <p style="font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #6366f1; margin: 0 0 8px;">Your reset code</p>
          <p style="font-size: 36px; font-weight: 700; letter-spacing: 0.3em; color: #1a1a2e; font-family: monospace; margin: 0;">${otp}</p>
        </div>

        <p style="color: #9ca3af; font-size: 12px; margin: 0;">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
      </div>
    </body>
    </html>
  `

  const result = await resend.emails.send({
    from: FROM,
    to: recipient,
    subject: `${otp} is your FurniTrack password reset code`,
    html,
  })

  // Resend returns { data, error } — throw if there's an error
  if (result.error) {
    throw new Error(`Resend error: ${result.error.message ?? JSON.stringify(result.error)}`)
  }
}
