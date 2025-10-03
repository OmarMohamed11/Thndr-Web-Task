lets create a nicely structured web application using React that is scalable and easy to maintain. The app is a stock market app. It should show all stocks listed in Nasdaq exchange.

help me think through how to break this into iterative pieces and write plan.md

## Tech Stack

- React 18 - UI library
- TypeScript - Type safety and developer experience
- Vite - Fast build tool and dev server
- shadcn/ui + Radix UI - Accessible component library
- TanStack Query (React Query) - Server state management
- Playwright - End-to-end testing
- Vitest + React Testing Library - Unit and integration testing
- ESLint - Code linting and quality

## Project Structure

src/
├── components/ # Reusable UI components
│ ├── ui/ # shadcn/ui components
│ └── Button.tsx
│ └── Button.test.tsx
├── features/ # Feature-based modules
│ └── auth/
│ ├── Login.tsx
│ └── Login.test.tsx
├── hooks/ # Custom React hooks
│ ├── useAuth.ts
│ └── useAuth.test.ts
├── lib/ # Utility functions and configurations
│ ├── utils.ts
│ └── utils.test.ts
├── pages/ # Page components
├── services/ # API services and data fetching
│ ├── api.ts
│ └── api.test.ts
└── types/ # TypeScript type definitions
Note: Test files are colocated with their source files using the .test.ts(x) naming convention.

## Development Guidelines

### Code Style

- Follow TypeScript strict mode
- Use ESLint rules - run npm run lint before committing
- Prefer functional components with hooks
- Use meaningful variable and function names
- Component Development
- Place reusable components in src/components/
- Use shadcn/ui components from src/components/ui/
- Keep components small and focused on a single responsibility
- Extract business logic into custom hooks

### State Management

- Use React Query for server state (API data, caching)
- Use React hooks (useState, useReducer) for local UI state
- Avoid prop drilling - consider composition or context for shared state

### Testing Guidelines:

Write unit tests for utility functions and custom hooks
Use React Testing Library for component tests
Focus on testing user behavior, not implementation details
Use Playwright for critical user flows and integration scenarios

## Requirements

Project Overview
A stock market application that displays stocks listed on the Nasdaq exchange with search functionality and infinite scrolling.

## Functional Requirements

### Splash Screen

Display Nasdaq logo centered on the screen
Show developer's name at the bottom of the screen
Acts as the initial loading screen for the application

### Explore Screen (Main Screen)

Display a list of stocks from Nasdaq exchange showing:
Stock ticker symbol
Full company name
Implement infinite scroll to load more stocks progressively
Backend-powered search functionality:
Search triggers while user is typing (real-time search)
Search by ticker or company name
Results should be fetched from the API

## Non-Functional Requirements

### Performance

Cache API responses to prevent redundant requests
Optimize for smooth scrolling performance
Handle rate limiting gracefully

## Code Quality

Use TypeScript for type safety
Organize code for scalability and easy feature additions
Follow clean code principles
Write unit tests for components and logic

## User Experience

Clean and responsive UI design
Proper error handling and user feedback
Loading states for async operations
Empty states for no results

## Design Guidelines

check witeframe.png

vibrant yellow[#fefd02] and black Color palette and theming
Typography scale
Responsive breakpoints
Animation and interaction patterns
Accessibility requirements (WCAG level, keyboard navigation, etc.)

## API Integration

Polygon.io Stocks API
Base URL: https://api.polygon.io

Authentication: API Key required (sign up at Polygon.io)

### Key Endpoints:

Get Stock Tickers
Endpoint: /v3/reference/tickers
Method: GET
Query Parameters:
market: stocks
exchange: XNAS (Nasdaq)
active: true
limit: Number of results per page
search: Search query (optional)
apiKey: Your API key
Response: List of tickers with name and symbol

## Implementation Notes:

- Use React Query for caching and request management
- Implement rate limiting handling (Polygon.io free tier has limits)
- Cache responses to minimize API calls
- Handle pagination for infinite scroll
- Debounce search input to reduce API calls
- Use git and pnpm, use descriptive commits

## Environment Variables

Create a .env file in the root directory:

env
VITE_POLYGON_API_KEY=your_polygon_api_key_here
VITE_API_BASE_URL=https://api.polygon.io
Note: Sign up at Polygon.io to get your free API key.

Check off items in the plan as we accomplish them as a todo list, if yoy have open questions that require my input, add those in the plan as well
