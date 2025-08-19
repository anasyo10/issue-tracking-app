# Issue Tracking App

A modern, responsive issue tracking application built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## Features

- 📋 **Project Management**: Create, view, edit, and delete projects
- 🐛 **Issue Tracking**: Comprehensive issue management with status tracking
- 💬 **Comments System**: Add and manage comments on issues
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean interface built with Radix UI components
- 🔔 **Toast Notifications**: User-friendly feedback with Sonner
- ⚡ **Fast Performance**: Optimized with Next.js 15 features

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint with Next.js config

## Prerequisites

Before running this application, ensure you have:

- Node.js 18.0 or later
- Yarn package manager
- A backend API server running (see Environment Setup)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd issue-tracking-app
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Environment Setup

Copy the environment example file and configure your backend API:

```bash
cp .env.example .env.local
```

Edit `.env.local` and update the backend API URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

**Important**: Make sure your backend API server is running and accessible at the configured URL.

### 4. Run the development server

```bash
yarn dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser to see the application.

## Testing

This project includes comprehensive test coverage for all major components and functionality.

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage report
yarn test:coverage
```

### Test Structure

- `__tests__/components/` - Component unit tests
- `__tests__/pages/` - Page component tests
- `__tests__/lib/` - Utility function tests
- `__tests__/setup.ts` - Test configuration and mocks

### Testing Tools

- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers
- **@testing-library/user-event**: User interaction simulation

## Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── projects/                # Project-related pages
├── components/                   # Reusable React components
│   ├── ui/                      # Base UI components (Radix)
│   ├── Comments.tsx             # Comments functionality
│   ├── IssueForm.tsx            # Issue creation/editing
│   ├── IssueTable.tsx           # Issue listing
│   └── ProjectList.tsx          # Project listing
├── lib/                         # Utility functions
│   ├── api.ts                   # API client functions
│   └── utils.ts                 # Helper utilities
├── types/                       # TypeScript type definitions
│   └── index.ts                 # Shared types
├── __tests__/                   # Test files
└── public/                      # Static assets
```

## API Integration

The application expects a REST API backend with the following endpoints:

### Projects

- `GET /projects` - List all projects
- `POST /projects` - Create a new project
- `GET /projects/:id` - Get project details
- `PUT /projects/:id` - Update a project
- `DELETE /projects/:id` - Delete a project

### Issues

- `GET /projects/:projectId/issues` - List project issues
- `POST /projects/:projectId/issues` - Create a new issue
- `GET /projects/:projectId/issues/:id` - Get issue details
- `PUT /projects/:projectId/issues/:id` - Update an issue
- `DELETE /projects/:projectId/issues/:id` - Delete an issue

### Comments

- `GET /issues/:issueId/comments` - List issue comments
- `POST /issues/:issueId/comments` - Create a new comment
- `DELETE /issues/:issueId/comments/:id` - Delete a comment

## Development

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn test` - Run tests
- `yarn test:watch` - Run tests in watch mode
- `yarn test:coverage` - Generate test coverage report

### Code Style

This project uses ESLint with Next.js configuration for code quality and consistency. Run `yarn lint` to check for issues.

### Building for Production

```bash
yarn build
yarn start
```

The application will be optimized and ready for deployment.

## Deployment

This Next.js application can be deployed to various platforms:

- **Vercel** (recommended): Connect your repository for automatic deployments
- **Netlify**: Deploy with automatic builds
- **AWS**: Use AWS Amplify or custom EC2/ECS setup
- **Docker**: Build and run in containers

Make sure to set the `NEXT_PUBLIC_API_BASE_URL` environment variable in your deployment platform.
