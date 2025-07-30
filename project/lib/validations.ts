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
    .max(500, "Description:  Must not exceed 500 characters."),

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

// Project member data input validation
export const ProjectMemberSchema = z.object({

  // Project id validation
  projectId: z
    .union([z.string(), z.undefined()])
    .refine((val) => val && val.length > 0, {
      message: "Project: Must select a project to add member to."
    }),

  // User with role validation
  members: z.array(z
    .object({}))
    .min(1, "User: Must select at least one user to be added.")

});

// Task data validation
export const TaskSchema = z.object({

  // Project id validation
  projectId: z
    .union([z.string(), z.undefined()])
    .refine((val) => val && val.length > 0, {
      message: "Project: Must select a project to assign task to."
    }),

  // Title validation
  title: z
    .string()
    .min(3, "Title: Must be at least 3 characters.")
    .max(50, "Title: Must not exceed 50 characters."),

  // Description validation
  description: z
    .string()
    .min(10, "Description: Must be at least 10 characters.")
    .max(500, "Description:  Must not exceed 500 characters."),

  // Label validation
  label: z
    .string()
    .min(3, "Label: Must be at least 3 characters.")
    .max(50, "Label: Must not exceed 50 characters."),

  // User validation
  members: z.array(z
    .object({}))
    .min(1, "User: Must select at least one user to assign task to."),
  
  // Due date validation
  dueDate: z.preprocess(
    (val) => {
      if(typeof val === "string" || val instanceof Date){
        const parsed = new Date(val);
        return isNaN(parsed.getTime()) ? null : parsed;
      }
      return null;
    },
    z.date().nullable()
  ),
  deadline: z.any().optional()
  
})
.superRefine((data, ctx) => {
    const { dueDate, deadline } = data;
    if(!dueDate){
      ctx.addIssue({
        path: ["dueDate"],
        code: z.ZodIssueCode.custom,
        message: "Due Date: Must be a valid date.",
      });
      return;
    } 
    if(dueDate <= new Date()){
      ctx.addIssue({
        path: ["dueDate"],
        code: z.ZodIssueCode.custom,
        message: "Due Date: Must be in the future.",
      });
      return;
    }
    if(dueDate && deadline && dueDate > deadline){
      ctx.addIssue({
        path: ["dueDate"],
        code: z.ZodIssueCode.custom,
        message: "Due Date: Must be on or before the project deadline.",
      });
      return;
    }
});