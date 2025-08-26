import { z } from "zod"

// Project data input validation
export const ProjectSchema = z.object({

  // Name validation
  name: z
    .string().trim()
    .min(3, "Name: Must be at least 3 characters.")
    .max(50, "Name: Must not exceed 50 characters."),

  // Description validation
  description: z
    .string().trim()
    .min(10, "Description: Must be at least 10 characters."),

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
    )),

  // Column name validation
  columnName: z
    .string().trim()
    .min(3, "Column Name: Must be at least 3 characters.")
    .max(50, "Column Name: Must not exceed 50 characters."),
  
});

// Task data input validation
export const TaskSchema = z.object({

  // Title validation
  title: z
    .string().trim()
    .min(3, "Title: Must be at least 3 characters.")
    .max(50, "Title: Must not exceed 50 characters."),

  // Description validation
  description: z
    .string().trim()
    .min(10, "Description: Must be at least 10 characters."),

  // Label validation
  label: z
    .string().trim()
    .min(3, "Label: Must be at least 3 characters.")
    .max(50, "Label: Must not exceed 50 characters."),
  
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
    )),

});