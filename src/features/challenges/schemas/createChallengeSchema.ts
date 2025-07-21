import { z } from "zod";

export const CreateChallengeSchema = z.object({
  title: z.string().trim().min(1, "Challenge title is required"),
  companyName: z.string().trim().min(1, "Company name is required"),
  sectorId: z.string().min(1, "Please choose a sector"),
  description: z.string().trim().min(1, "Description is required"),
  expectation: z.string().trim().min(1, "Expectation is required"),
  sdgIds: z
    .array(z.string())
    .min(1, "Please choose at least one SDG")
    .max(4, "Maximum 4 SDGs allowed"),
  logoUrl: z.string().min(1, "Please choose a logo"),
});

export type CreateChallengeSchemaType = z.infer<typeof CreateChallengeSchema>;
