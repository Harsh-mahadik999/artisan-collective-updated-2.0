# Artisan Collective - Handmade Marketplace Platform

## Overview

Artisan Collective is a full-stack web application that connects artisans with customers looking for authentic handmade crafts. The platform features a marketplace for artisan products, community storytelling, AI-powered content generation, and an intelligent recommendation system. Built with modern web technologies, it provides a comprehensive solution for showcasing traditional craftsmanship while supporting artisan communities worldwide.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Main UI framework with type safety
- **Vite**: Fast build tool and development server with HMR support
- **Wouter**: Lightweight client-side routing
- **TanStack Query**: Server state management and data fetching
- **Tailwind CSS**: Utility-first styling framework
- **Shadcn/ui**: Pre-built accessible component library with Radix UI primitives

### Backend Architecture
- **Express.js**: RESTful API server with TypeScript
- **In-Memory Storage**: Development-friendly data layer with interface abstraction for future database integration
- **OpenAI Integration**: AI-powered story generation for product descriptions and marketing content
- **Session-based Cart**: Shopping cart functionality with guest session support

### Data Management
- **Drizzle ORM**: Type-safe database toolkit configured for PostgreSQL
- **Schema Design**: Well-structured database models for artisans, products, stories, cart items, and AI generations
- **Shared Schema**: Common type definitions between frontend and backend using Zod validation

### UI/UX Design System
- **Design Tokens**: Consistent theming with CSS custom properties
- **Component Architecture**: Modular, reusable components with proper separation of concerns
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Accessibility**: Built on Radix UI primitives for keyboard navigation and screen reader support

### Key Features Architecture
- **Marketplace**: Product catalog with filtering, search, and categorization
- **Artisan Profiles**: Detailed artisan information with product listings
- **AI Storytelling**: OpenAI integration for generating product descriptions and social media content
- **Shopping Cart**: Session-based cart with real-time updates
- **Community Stories**: Content management for artisan stories and cultural heritage
- **Smart Recommendations**: User preference tracking and personalized suggestions

### Development & Build Process
- **Development**: Hot module replacement with Vite dev server
- **Production Build**: Static asset generation with Express server bundling via esbuild
- **Type Safety**: Full TypeScript coverage with strict configuration
- **Code Organization**: Clear separation between client, server, and shared code

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client for production database
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration toolkit
- **@tanstack/react-query**: Server state management
- **openai**: Official OpenAI API client for AI content generation
- **express**: Web application framework
- **react & react-dom**: Frontend framework

### UI Libraries
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Conditional styling utilities

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type system
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **esbuild**: Fast JavaScript bundler for production builds

### Validation & Forms
- **zod**: TypeScript-first schema validation
- **drizzle-zod**: Integration between Drizzle ORM and Zod
- **react-hook-form**: Performant forms library
- **@hookform/resolvers**: Form validation resolvers

### Utility Libraries
- **date-fns**: Date manipulation utilities
- **nanoid**: Unique ID generation
- **connect-pg-simple**: PostgreSQL session store for Express
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel component