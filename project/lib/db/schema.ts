import { pgEnum, pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core"

// Set allowed values in priority and role columns
export const priorityEnum = pgEnum("priority", ["Low", "Medium", "High"]);
export const roleEnum = pgEnum("role", ["Viewer", "Project Manager", "Developer", "Designer", "QA Engineer"]);

// Table "users" schema and export types
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  fname: text("fname").notNull(),
  lname: text("lname").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UpdateUser = Partial<NewUser>;

// Table "projects" schema and export types
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id").notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type UpdateProject = Partial<NewProject>;

// Table "project_members" schema and export types
export const projectMembers = pgTable("project_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
export type ProjectMember = typeof projectMembers.$inferSelect;
export type NewProjectMember = typeof projectMembers.$inferInsert;
export type UpdateProjectMember = Partial<NewProjectMember>;

// Table "tasks" schema and export types
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date").notNull(),
  priority: priorityEnum("priority").notNull(),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type UpdateTask = Partial<NewTask>;

// Table "task_assignees" schema and export types
export const taskAssignees = pgTable("task_assignees", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id").notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
export type TaskAssignee = typeof taskAssignees.$inferSelect;
export type NewTaskAssignee = typeof taskAssignees.$inferInsert;
export type UpdateTaskAssignee = Partial<NewTaskAssignee>;

// Table "comments" schema and export types
export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  taskId: uuid("task_id").notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type UpdateComment = Partial<NewComment>;