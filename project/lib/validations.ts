import { z } from "zod"

// Project data input validation
export const ProjectSchema = z.object({

  // Name validation
  name: z
    .string()
    .min(3, "Name: Must be at least 3 characters.")
    .max(50, "Name: Must not exceed 50 characters."),

  // Description validation
  description: z
    .string()
    .min(10, "Description: Must be at least 10 characters.")
    .max(300, "Description:  Must not exceed 300 characters."),

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
            message: "Due Date: Must be a valid date."
          });
          return;
        }
        if(date <= new Date()){
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Due Date: Must be in the future."
          });
        }
      }
    )
  )
});



export const ProjectMemberSchema = z.object({
  projectId: z
    .union([z.string(), z.undefined()])
    .refine((val) => val && val.length > 0, {
      message: "Project: Must select a project to add member to."
    }),

  userId: z
    .union([z.string(), z.undefined()])
    .refine((val) => val && val.length > 0, {
      message: "User: Must select a user to add in the project."
    })

});