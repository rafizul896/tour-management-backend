import { z } from "zod";

export const guideValidationSchema = z.object({
  division: z.string().min(1, {
    message: "Division is required",
  }),
});


