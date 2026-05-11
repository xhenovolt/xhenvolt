import { z } from "zod";

export const contactMessageInput = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(240),
  phone: z.string().trim().max(80).optional().nullable(),
  subject: z.string().trim().max(240).optional().nullable(),
  message: z.string().trim().min(5).max(5000),
  source: z.string().trim().max(80).optional().nullable(),
});

export type ContactMessageInput = z.infer<typeof contactMessageInput>;
