import { z } from "zod";

export const askInput = z.object({
  query: z.string().trim().min(1).max(2000),
  sessionId: z.string().trim().max(80).optional(),
});

export type AskInput = z.infer<typeof askInput>;
