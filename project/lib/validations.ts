import { z } from "zod"
import { RoleArr } from "./customtype";










// Project data validation
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
  dueDate: z
    .preprocess(
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

  // Column count validation
  columnCount: z
    .number()
    .int("Column Count: Must be an integer.")
    .min(3, "Column Count: Must be at least 3."),

  // Column names validation
  columnNames: z
    .array(z.string().trim()
      .min(3, "Column Name: Must be at least 3 characters.")
      .max(50, "Column Name: Must not exceed 50 characters."))
    .min(3, "Column Names: Must provide at least 3 column names."),

  // Column name validation
  columnName: z
    .string().trim()
    .min(3, "Column Name: Must be at least 3 characters.")
    .max(50, "Column Name: Must not exceed 50 characters."),
  
});
export const ClientCreateProjectSchema = ProjectSchema.pick({ name: true, description: true, dueDate: true});
export const ServerCreateProjectSchema = ProjectSchema.pick({ name: true, description: true, dueDate: true, columnCount: true, columnNames: true });

// Project member data schema
export const ProjectMemberSchema = z.object({

  // Project ID validation
  projectId: z
    .uuid("Project ID: Must be a valid UUID."),

  // User ID validation
  userId: z
    .uuid("User ID: Must be a valid UUID."),

  // Role validaiton
  role: z
    .enum(RoleArr, "Role: Must be a valid project role."),

  // Approved validation
  approved: z
    .boolean()
    .refine((val) => typeof val === "boolean", {message: "Approved: Must be true or false."}),

});
export const ServerCreateProjectMemberSchema = ProjectMemberSchema.pick({ projectId: true, userId: true, role: true, approved: true});




























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

// User data input validation
export const UserSchema = z.object({

  // First name validation
  fname: z
    .string().trim()
    .min(1, "First name: Cannot be empty."),

  // Last name validation
  lname: z
    .string().trim()
    .min(1, "Last name: Cannot be empty."),

  // Password validation
  pword: z
    .string().trim()
    .min(8, "Password: Must be at least 8 characters.")
    .max(72, "Password: Must be at most 72 characters.")
    .refine((val) => !/\s/.test(val), "Password: Must not contain spaces.")
    .refine((val) => /[a-z]/.test(val), "Password: Must include at least one lowercase letter.")
    .refine((val) => /[A-Z]/.test(val), "Password: Must include at least one uppercase letter.")
    .refine((val) => /\d/.test(val), "Password: Must include at least one number.")
    .refine((val) => /[^A-Za-z0-9]/.test(val), "Password: Must include at least one symbol (e.g., !@#$%)."),
  
});

// Validate updating first name and last name
export const NameSchema = UserSchema.pick({ fname: true, lname: true });

// Validate updating password
export const PasswordSchema = UserSchema.pick({ pword: true });