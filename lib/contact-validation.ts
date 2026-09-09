import { z } from "zod";

export const contactProjectTypes = ["Web Development", "Mobile App Development", "Software Development", "UI/UX Design", "Cybersecurity", "Cloud & Infrastructure", "Automation", "Custom Digital Product", "Something Else"] as const;

export const contactSchema = z.object({
  requestId: z.string().uuid(),
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(254).transform(value => value.toLowerCase()),
  company: z.string().trim().max(160).default(""),
  projectType: z.enum(contactProjectTypes, { errorMap: () => ({ message: "Please choose a project type." }) }),
  message: z.string().trim().min(10, "Tell us about your project in at least 10 characters.").max(5000),
  website: z.string().max(200).optional().default(""),
}).strict();
