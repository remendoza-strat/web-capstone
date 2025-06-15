# Code Review & Collaboration Guide

## Overview

Code reviews are a cornerstone of professional software development. They help ensure code quality, share knowledge, and maintain consistency across the team. This guide outlines our code review process and best practices.

## Code Review Process

### 1. Before Creating a Pull Request

#### Self-Review Checklist
- [ ] Code follows TypeScript and ESLint rules
- [ ] All tests pass locally (`npm test`)
- [ ] Code is properly formatted (`npm run lint:fix`)
- [ ] No console.log statements or debugging code
- [ ] Meaningful commit messages following convention
- [ ] Branch is up to date with main

#### Code Quality Standards
- [ ] Functions are small and focused (single responsibility)
- [ ] Variables and functions have descriptive names
- [ ] Complex logic includes comments explaining the "why"
- [ ] Error handling is implemented where appropriate
- [ ] TypeScript types are properly defined (no `any`)

### 2. Creating a Pull Request

#### PR Title Format
```
<type>(<scope>): <description>

Examples:
feat(auth): add Clerk authentication integration
fix(kanban): resolve drag-and-drop state sync issue
docs(setup): update development environment guide
```

#### PR Description Template
```markdown
## 🎯 What does this PR do?
Brief description of the changes and why they were made.

## 🧪 How to test
Step-by-step instructions for testing the changes:
1. Check out this branch
2. Run `npm install` if dependencies changed
3. Test specific functionality...

## ✅ Checklist
- [ ] Code follows project conventions
- [ ] Tests added/updated and passing
- [ ] Documentation updated if needed
- [ ] No breaking changes (or documented if necessary)
- [ ] Reviewed my own code changes

## 📷 Screenshots (if applicable)
Include before/after screenshots for UI changes.

## 🔗 Related Issues
Closes #123
Related to #456
```

#### Linking to Issues
- Use `Closes #issue-number` to automatically close issues
- Use `Related to #issue-number` for related work
- Reference specific tasks from the main task list

### 3. Code Review Guidelines

#### For Authors

##### Writing Reviewable Code
- **Keep PRs small**: Aim for 200-400 lines of changes max
- **Single purpose**: Each PR should address one feature/fix
- **Clear context**: Provide good descriptions and comments
- **Test coverage**: Include relevant tests for new functionality

##### Responding to Feedback
- **Be receptive**: View feedback as learning opportunities
- **Ask questions**: If feedback is unclear, ask for clarification
- **Explain decisions**: If you disagree, explain your reasoning respectfully
- **Make requested changes**: Address all feedback before requesting re-review

#### For Reviewers

##### Review Focus Areas

**1. Functionality**
- Does the code do what it's supposed to do?
- Are edge cases handled appropriately?
- Is error handling implemented correctly?

**2. Code Quality**
- Is the code readable and maintainable?
- Are functions and variables well-named?
- Is the code following project conventions?

**3. Performance**
- Are there any obvious performance issues?
- Is the code efficiently written?
- Are there unnecessary re-renders or computations?

**4. Security**
- Are user inputs properly validated?
- Are sensitive data and secrets handled correctly?
- Are authentication and authorization working properly?

**5. Testing**
- Are there appropriate tests for new functionality?
- Do tests cover edge cases and error scenarios?
- Are tests readable and maintainable?

##### Providing Feedback

**Use Constructive Language**
```
❌ "This is wrong"
✅ "Consider using useState here instead of useRef for this use case"

❌ "Bad variable name"  
✅ "Could we use a more descriptive name like 'activeProjectId' instead of 'id'?"

❌ "This won't work"
✅ "This might cause issues when the user has no projects. Should we add a loading state?"
```

**Categories of Feedback**
- **Must Fix**: Critical issues that prevent merge
- **Should Fix**: Important improvements that should be addressed
- **Consider**: Suggestions for improvement (nice to have)
- **Question**: Asking for clarification or understanding

**Example Comments**
```
[MUST FIX] This will cause a runtime error if projects is undefined. 
Add optional chaining: projects?.map()

[SHOULD FIX] Consider extracting this logic into a custom hook 
for reusability across components.

[CONSIDER] We could use a more semantic HTML element here, 
like <section> instead of <div>, for better accessibility.

[QUESTION] Why did you choose Zustand over React Context for this state? 
I'm curious about the reasoning.
```

##### Review Response Times
- **Initial review**: Within 24 hours
- **Follow-up reviews**: Within 4-6 hours during work hours
- **Emergency fixes**: Within 2 hours

### 4. Common Code Review Patterns

#### Next.js Specific Reviews

**Server vs Client Components**
```typescript
// ❌ Unnecessary client component
'use client'
export function ProjectList({ projects }) {
  return (
    <div>
      {projects.map(project => <div key={project.id}>{project.name}</div>)}
    </div>
  )
}

// ✅ Server component is sufficient
export function ProjectList({ projects }) {
  return (
    <div>
      {projects.map(project => <div key={project.id}>{project.name}</div>)}
    </div>
  )
}
```

**Server Actions Usage**
```typescript
// ❌ Missing error handling and validation
export async function createProject(name: string) {
  await db.insert(projects).values({ name })
  revalidatePath('/dashboard')
}

// ✅ Proper validation and error handling
export async function createProject(formData: FormData) {
  const name = formData.get('name') as string
  
  if (!name || name.trim().length < 3) {
    throw new Error('Project name must be at least 3 characters')
  }
  
  try {
    await db.insert(projects).values({ 
      name: name.trim(),
      userId: auth().userId 
    })
    revalidatePath('/dashboard')
  } catch (error) {
    console.error('Failed to create project:', error)
    throw new Error('Failed to create project')
  }
}
```

#### React Best Practices

**Proper Hooks Usage**
```typescript
// ❌ Hooks in conditional
function TaskCard({ task }) {
  if (!task) return null
  
  const [isEditing, setIsEditing] = useState(false) // ❌ Hook after conditional
}

// ✅ Hooks at top level
function TaskCard({ task }) {
  const [isEditing, setIsEditing] = useState(false) // ✅ Hook at top
  
  if (!task) return null
}
```

**Component Composition**
```typescript
// ❌ Prop drilling and tight coupling
function Dashboard({ user, projects, onCreateProject, onEditProject }) {
  return (
    <div>
      <Header user={user} />
      <ProjectList 
        projects={projects} 
        onCreateProject={onCreateProject}
        onEditProject={onEditProject}
        user={user}
      />
    </div>
  )
}

// ✅ Better composition and separation of concerns
function Dashboard() {
  return (
    <div>
      <Header />
      <ProjectList />
    </div>
  )
}
```

#### TypeScript Standards

**Proper Type Definitions**
```typescript
// ❌ Using any or missing types
function updateTask(id, data) {
  // ...
}

// ✅ Proper typing
interface UpdateTaskData {
  title?: string
  description?: string
  status?: TaskStatus
}

function updateTask(id: string, data: UpdateTaskData): Promise<Task> {
  // ...
}
```

### 5. Review Tools and Automation

#### GitHub Features
- **Request reviews**: Always request review from at least one team member
- **Review comments**: Use line-by-line comments for specific feedback
- **Suggestions**: Use GitHub's suggestion feature for small fixes
- **Required reviews**: Main branch requires at least one approval

#### Automated Checks
- **CI/CD Pipeline**: All tests must pass before merge
- **Type checking**: TypeScript compilation must succeed
- **Linting**: ESLint rules must pass
- **Format checking**: Prettier formatting must be correct

### 6. Conflict Resolution

#### When Reviewers Disagree
1. **Discussion**: Have a respectful technical discussion
2. **Research**: Look up best practices and documentation
3. **Mentor input**: Escalate to mentor if needed
4. **Team decision**: Discuss in team meeting if necessary

#### When Reviews Are Delayed
1. **Gentle reminder**: Ping in team chat after 24 hours
2. **Request different reviewer**: If original reviewer is busy
3. **Escalate**: Bring to mentor's attention if blocking progress

### 7. Learning from Reviews

#### For Authors
- **Take notes**: Document feedback for future reference
- **Ask questions**: Understand the reasoning behind suggestions
- **Apply learnings**: Use feedback to improve future code
- **Share knowledge**: Help teammates avoid similar issues

#### For Reviewers
- **Learn from others**: See different approaches to problems
- **Stay updated**: Learn new patterns and best practices
- **Document patterns**: Contribute to team knowledge base
- **Improve feedback**: Get better at giving constructive feedback

## Review Metrics and Goals

### Team Goals
- **Review response time**: < 24 hours for initial review
- **Code quality**: Maintain high standards while being supportive
- **Knowledge sharing**: Everyone learns from every review
- **Constructive culture**: Reviews help growth, not blame

### Individual Goals
- **Give quality reviews**: Thoughtful, helpful feedback
- **Receive feedback well**: Open to learning and improvement
- **Continuous improvement**: Get better at both coding and reviewing
- **Help teammates**: Mentor and support each other

Remember: **Code reviews are a team learning exercise, not a judgment of your abilities!** Everyone is here to grow and improve together.
