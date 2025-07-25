import { z } from "zod"

// Project data input validation
export const ProjectSchema = z.object({

  // Name validation
  name: z
    .string()
    .min(3, "Name: Project name must be at least 3 characters.")
    .max(60, "Name: Project name must not exceed 60 characters."),

  // Description validation
  description: z
    .string()
    .min(10, "Description: Description must be at least 10 characters.")
    .max(300, "Description:  Description must not exceed 300 characters."),

  // Due date validation
  dueDate: z.preprocess(
    (val) => {
      if(typeof val === "string" || val instanceof Date){
        const parsed = new Date(val);
        return isNaN(parsed.getTime()) ? null : parsed;
      }
      return null;
    },
    z
      .date()
      .nullable()
      .superRefine((date, ctx) => {
        if(date === null){
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Due Date: Invalid date input."
          });
          return;
        }
        if(date <= new Date()){
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Due Date: Due date must be in the future."
          });
        }
      }
    )
  )
});

// Type for project zod schema 
export type ProjectInput = z.infer<typeof ProjectSchema>;