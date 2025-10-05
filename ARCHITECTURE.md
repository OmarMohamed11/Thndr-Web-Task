# Stock Explorer - Component Architecture

## Component Architecture

```mermaid
graph TD
    A[App] --> B[Header]
    A --> C[Explore]
    A --> D[Toaster]
    A --> E[Splash]

    B --> F[SearchBar]
    B --> G[Logo]

    C --> H[LoadingSpinner]
    C --> I[ErrorState]
    C --> J[StockCard Grid]

    J --> K[StockCard]
    K --> L[Card]
    K --> M[Badge]
```

## Component Descriptions

### Core Components

- **App**: Root component managing application state and routing between Splash and main app
- **Header**: Navigation header containing logo and search functionality
- **Explore**: Main page component for displaying stock listings with infinite scroll
- **SearchBar**: Input component with debounced search functionality
- **StockCard**: Individual stock display component with company info and ticker badge

### UI Components

- **LoadingSpinner**: Loading indicator for async operations
- **ErrorState**: Error display component with retry functionality
- **Toaster**: Toast notification system for user feedback
- **Splash**: Initial loading screen component
