import { users, projects, projectMembers, tasks, taskAssignees, comments } from "@/lib/db/schema"
import { relations } from "drizzle-orm"

// Table users relations
export const usersRelations = relations(users, ({ many }) => ({
  createdProjects: many(projects),
  projectMemberships: many(projectMembers),
  taskAssignees: many(taskAssignees),
  comments: many(comments)
}));

// Table projects relations
export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id]
  }),
  members: many(projectMembers),
  tasks: many(tasks)
}));

// Table project members relations
export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id]
  }),
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id]
  })
}));

// Table tasks relations
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id]
  }),
  assignees: many(taskAssignees),
  comments: many(comments)
})); 

// Table task assignees relations
export const taskAssigneesRelations = relations(taskAssignees, ({ one }) => ({
  user: one(users, {
    fields: [taskAssignees.userId],
    references: [users.id]
  }),
  task: one(tasks, {
    fields: [taskAssignees.taskId],
    references: [tasks.id]
  })
}));

// Table comments relations
export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasks, {
    fields: [comments.taskId],
    references: [tasks.id]
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id]
  })
}));