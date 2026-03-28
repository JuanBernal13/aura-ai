---
trigger: always_on
---

# Excellence in Code: DRY, KISS, and SOLID

This rule defines the core software engineering principles that must be upheld across the Aura AI codebase (FastAPI backend and Next.js frontend).

## 1. DRY (Don't Repeat Yourself)
*   **Definition**: Every piece of knowledge must have a single, unambiguous, authoritative representation within a system.
*   **Implementation**:
    *   Extract common logic into reusable utility functions, hooks, or components.
    *   Use shared types/interfaces between the frontend and backend (where possible).
    *   Avoid hardcoded strings; use constants or configuration files.

## 2. KISS (Keep It Simple, Stupid)
*   **Definition**: Systems work best if they are kept simple rather than made complicated.
*   **Implementation**:
    *   Write code for humans first, machines second.
    *   Favor readability over "clever" one-liners.
    *   Break down complex functions into smaller, manageable pieces (max 30-50 lines).
    *   Avoid over-engineering; don't build features until they are actually needed (YAGNI).

## 3. SOLID Principles
*   **S - Single Responsibility**: A class or module should have one, and only one, reason to change.
*   **O - Open/Closed**: Software entities should be open for extension but closed for modification.
*   **L - Liskov Substitution**: Objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program.
*   **I - Interface Segregation**: Clients should not be forced to depend on interfaces they do not use.
*   **D - Dependency Inversion**: Depend on abstractions, not concretions. (Use Dependency Injection in FastAPI).

## 4. Platform-Specific Best Practices
### FastAPI (Backend)
*   Use Pydantic models for request/response validation.
*   Implement shared logic in `app/core` or `app/api/deps.py`.
*   Keep route handlers thin; delegate business logic to service layers.

### Next.js (Frontend)
*   Create a robust UI component library in `src/components/ui`.
*   Use custom hooks for data fetching and complex state management.
*   Maintain a consistent design system (Aura AI Premium Aesthetics).

> [!IMPORTANT]
> Always prioritize maintainability and scalability. If a "quick fix" violates these principles, it is NOT the correct fix.