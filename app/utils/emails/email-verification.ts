import { sendEmail } from "./send-email";

export const sendVerificationEmail = async ({
  user,
  url,
}: {
  user: { email: string; name: string };
  url: string;
}) => {
  return sendEmail({
    to: user.email,
    subject: "Welcome to Nuxt Auth! Please Verify Your Email",
    html:
      `<p>Hi ${user.name},</p>` +
      `<p>Please verify your email address by clicking the link below:</p>` +
      `<a href="${url}">Verify Email</a>` +
      `<p>If you did not request this, please ignore this email.</p>`,
  });
};
