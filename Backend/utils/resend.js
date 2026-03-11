import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a password reset email with a reset link.
 * @param {string} to - Recipient email address
 * @param {string} resetURL - The full password reset URL
 */
export const sendPasswordResetEmail = async (to, resetURL) => {
  const { data, error } = await resend.emails.send({
    from: "MealMate <onboarding@resend.dev>",
    to,
    subject: "Reset Your Password - MealMate",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi there,</p>
        <p>We received a request to reset your MealMate account password. Click the button below to set a new password:</p>
        <a href="${resetURL}" 
           style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px;">This link will expire in <strong>15 minutes</strong>.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">— MealMate Team</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error("Failed to send password reset email");
  }

  return data;
};
