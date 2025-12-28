import { sendEmail } from "./send-email";

export const sendPasswordResetEmail = async ({
  user,
  url,
}: {
  user: { email: string; name: string };
  url: string;
}) => {
  return sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    html:
      `<p>Hi ${user.name},</p>` +
      `<p>You requested a password reset. Click the link below to reset your password:</p>` +
      `<a href="${url}">Reset Password</a>` +
      `<p>If you did not request this, please ignore this email.</p>`,
  });
};
