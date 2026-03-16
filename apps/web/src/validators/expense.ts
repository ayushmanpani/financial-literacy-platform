import { z } from "zod";

export const expenseSchema = z.object({
  category: z.string().min(2),
  amount: z.number().positive(),
  month: z.string()
});