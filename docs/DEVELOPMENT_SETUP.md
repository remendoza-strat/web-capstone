# Development Setup Guide

## Prerequisites

- **Node.js**: Version 20+ LTS
- **Git**: Latest version
- **VS Code**: Recommended IDE
- **PostgreSQL**: Database (we'll set up cloud version)

## Required VS Code Extensions

Install these extensions for the best development experience:

- **ESLint** (`ms-vscode.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **TypeScript Importer** (`pmneo.tsimporter`)
- **Auto Rename Tag** (`formulahendry.auto-rename-tag`)
- **GitLens** (`eamodio.gitlens`)

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rcdelacruz/nextjs-internship-capstone.git
cd nextjs-internship-capstone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template:

```bash
cp .env.example .env.local
```

Fill in the required environment variables (will be provided during onboarding).

### 4. Database Setup

Run database migrations:

```bash
npm run db:generate
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Workflow

### Git Workflow (GitHub Flow)

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-name/feature-description
   ```

2. **Make your changes** and commit regularly:
   ```bash
   git add .
   git commit -m "feat: add task creation modal"
   ```

3. **Push your branch**:
   ```bash
   git push origin feature/your-name/feature-description
   ```

4. **Open a Pull Request** on GitHub for code review

5. **Address feedback** and merge after approval

### Branch Naming Convention

- `feature/[your-name]/[feature-description]`
- `fix/[your-name]/[bug-description]`
- `docs/[your-name]/[documentation-update]`

Examples:
- `feature/sarah-jones/add-task-modal`
- `fix/john-doe/fix-drag-drop-bug`
- `docs/alex-smith/update-setup-guide`

### Commit Message Convention

Use conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open database studio (if using Drizzle Studio)

## Code Quality Standards

### TypeScript

- Use strict TypeScript mode
- Define proper types for all props and functions
- Avoid `any` type unless absolutely necessary
- Use proper type imports: `import type { ... }`

### React Best Practices

- Use functional components with hooks
- Follow the Rules of Hooks
- Use Server Components by default, Client Components when needed
- Proper error boundaries for error handling

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use Shadcn/UI components when possible
- Consistent spacing and typography scale

### File Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth-related pages
│   ├── (dashboard)/       # Dashboard pages
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/                # Shadcn/UI components
│   └── modals/            # Modal components
├── lib/                   # Utilities and configurations
│   ├── db/                # Database related
│   └── utils/             # Helper functions
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
├── types/                 # TypeScript type definitions
└── tests/                 # Test files
```

## Testing Guidelines

- Write unit tests for utility functions
- Test React components with React Testing Library
- Write integration tests for user flows
- E2E tests for critical user journeys
- Aim for 80%+ test coverage

## Getting Help

- **Daily Standups**: Share progress and blockers
- **Code Reviews**: Learn through peer feedback
- **Mentor Office Hours**: 1-on-1 guidance sessions
- **Team Chat**: Quick questions and collaboration
- **GitHub Issues**: Bug reports and feature requests

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. **Node modules issues**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Database connection issues**:
   - Check environment variables
   - Verify database is running
   - Check network connectivity

4. **TypeScript errors**:
   ```bash
   npm run type-check
   ```

### Getting Additional Help

If you're stuck for more than 30 minutes:

1. Check the documentation
2. Search existing GitHub Issues
3. Ask in team chat
4. Schedule time with mentor
5. Create a GitHub Issue with detailed description

Remember: **There are no "dumb" questions!** Everyone is here to learn and grow together.
