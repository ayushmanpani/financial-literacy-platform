import { z } from "zod";

export const profileSchema = z.object({
  income: z.number().positive(),
  occupation: z.string().min(2),
  familySize: z.number().int().min(1),
  location: z.string().min(2),
  savingsGoal: z.number().optional()
});