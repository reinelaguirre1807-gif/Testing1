# SmartExpense - AI-Powered Expense Tracker

## Overview

SmartExpense is a modern Progressive Web App (PWA) designed for intelligent expense tracking with AI integration. The application provides users with smart financial insights, beautiful data visualizations, and a clean YouTube Music-inspired UI. It features a freemium model with basic functionality for free users and enhanced AI-powered features for Pro subscribers.

The app supports multi-account financial management, automatic transaction categorization, subscription tracking, and comprehensive analytics with interactive charts. Built with a focus on user experience, it offers both light and dark themes with responsive design across all devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built using **React with TypeScript** and follows a component-based architecture. The UI framework leverages **shadcn/ui** components built on top of **Radix UI primitives** for accessibility and consistency. **Tailwind CSS** provides utility-first styling with a custom design system that includes CSS variables for theming.

**State Management**: The application uses **TanStack Query** (React Query) for server state management, providing caching, synchronization, and background updates. Local UI state is managed through React hooks and context providers.

**Routing**: Implemented using **wouter** for lightweight client-side routing with conditional rendering based on authentication status.

**PWA Features**: Service worker registration for offline functionality, web app manifest for installability, and responsive design for mobile-first user experience.

### Backend Architecture
The server follows a **RESTful API** design pattern built with **Express.js** and **TypeScript**. The architecture separates concerns through distinct layers:

**Database Layer**: **Drizzle ORM** provides type-safe database operations with **PostgreSQL** as the primary database. The schema includes users, accounts, transactions, subscriptions, and budget goals with proper foreign key relationships.

**Storage Interface**: A comprehensive `IStorage` interface abstracts database operations, making the system testable and allowing for future database migrations or multiple storage backends.

**Authentication Middleware**: Integration with **Replit Auth** using **OpenID Connect** for secure user authentication and session management with PostgreSQL session storage.

**Route Organization**: Modular route handlers separated by functionality (auth, accounts, transactions, subscriptions, analytics) with consistent error handling and request/response patterns.

### Data Storage Solutions
**Primary Database**: **PostgreSQL** with **Neon Database** as the serverless hosting solution, providing automatic scaling and connection pooling.

**Schema Design**: Normalized database structure with proper foreign key constraints, enums for type safety, and timestamp tracking for audit trails. Key entities include:
- Users with Pro subscription status
- Multiple account types (cash, savings, checking, credit, investment)
- Transactions with categorization and account relationships
- Subscription tracking for recurring expenses
- Budget goals with progress tracking

**Session Storage**: PostgreSQL-based session storage for authentication state management, ensuring scalability and persistence.

**Migration Strategy**: Drizzle Kit for database schema migrations with version control and rollback capabilities.

### Authentication and Authorization
**Authentication Provider**: **Replit Auth** integration using OpenID Connect protocol for secure, third-party authentication without managing user passwords.

**Session Management**: Server-side sessions stored in PostgreSQL with configurable TTL and secure cookie settings (httpOnly, secure flags).

**Authorization Pattern**: Route-level middleware (`isAuthenticated`) for protecting API endpoints, with user context injection for downstream handlers.

**User Data Isolation**: All user data is properly scoped by user ID to ensure data privacy and security between different users.

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with automatic scaling
- **Replit Auth**: OpenID Connect authentication provider
- **PayPal SDK**: Payment processing for Pro subscription upgrades

### Development and Build Tools
- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Type safety across the entire application
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Server-side bundling for production deployment

### UI and Styling Framework
- **Radix UI**: Unstyled, accessible component primitives
- **shadcn/ui**: Pre-built component library with consistent design system
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography

### Data Visualization and Charts
- **Chart.js**: Canvas-based charting library for interactive financial charts
- **React-Chartjs-2**: React wrapper for Chart.js integration

### Form and Data Management
- **React Hook Form**: Performant form handling with minimal re-renders
- **Zod**: TypeScript-first schema validation for forms and API validation
- **TanStack Query**: Server state management with caching and synchronization

### Utility Libraries
- **date-fns**: Date manipulation and formatting utilities
- **clsx** and **tailwind-merge**: Conditional CSS class name handling
- **nanoid**: Unique ID generation for client-side operations