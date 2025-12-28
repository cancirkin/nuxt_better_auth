import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  return resend.emails.send({
    from: process.env.RESEND_SENDER_EMAIL!,
    to: to,
    subject: subject,
    html: html,
  });
};
