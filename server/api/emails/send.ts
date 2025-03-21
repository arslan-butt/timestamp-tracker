import { Resend } from 'resend';
import type { H3Event } from 'h3';

const resend = new Resend(process.env.NUXT_PRIVATE_RESEND_API_KEY);

export default defineEventHandler(async (event: H3Event) => {
  const { to, subject, html } = await readBody(event);

  try {
    const data = await resend.emails.send({
      from: 'Arslan <engr.arslanbutt@gmail.com>',
      to: to,
      subject: subject,
      html: html,
    });
    return data;
  } catch (error) {
    return { error };
  }
});
