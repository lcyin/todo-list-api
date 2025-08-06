# Copilot Instructions: Hexagonal Architecture (Ports & Adapters) for TypeScript

## Overview

All code in this repository must follow the hexagonal architecture (ports and adapters pattern) using TypeScript best practices.

## Design Rules

### Core Domain Logic (Entities)

- Place all domain logic and business entities in the `domain/` folder
- No infrastructure or framework code (no Express, no database logic) in `domain/`

### Ports

- Define TypeScript interfaces for all inbound (driving) and outbound (driven) interactions:
  - **Inbound ports**: actions triggered by external actors (users, APIs)
  - **Outbound ports**: calls from the domain to external services (database, cache, APIs)
- Place port interfaces in `domain/ports/`

### Adapters

- Implement adapters for all ports in `adapters/`:
  - `adapters/primary`: inbound adapters (e.g., REST controllers, CLI handlers)
  - `adapters/secondary`: outbound adapters (e.g., database, external API clients)
- Adapters implement port interfaces and convert to/from domain models
- Adapters depend on domain interfaces, not on domain entities or logic

### Dependency Rule

- Domain code (`domain/`) must not depend on any code from `adapters/` or specific frameworks
- Adapters may import from `domain/`, especially port interfaces

### Testing

- Write pure unit tests for the domain logic (no databases or frameworks)
- Use stub/mocked adapters when writing integration tests

## File Organization Example

```text
domain/
├── User.ts
├── OrderService.ts
└── ports/
    ├── UserRepository.ts         # outbound port (interface)
    └── CreateOrderUseCase.ts     # inbound port (interface)

adapters/
├── primary/
│   ├── RestOrderController.ts
│   └── CliOrderCommand.ts
└── secondary/
    ├── MongoUserRepository.ts
    └── HttpPaymentGateway.ts
```

## Coding Best Practices

- Maintain clean separation: core logic, ports, adapters
- Use dependency inversion at boundaries
- Use dependency injection to wire adapters to ports
- Keep domain models and services free from technical (infrastructure/framework) code

_These guidelines ensure testability, maintainability, and adaptability. Strive for a loosely-coupled, technology-independent core._

---

**Apply these architecture guidelines to all files (`applyTo: "**"`) in the repository.**

---

## Further Reading

- Hexagonal Architecture (Ports & Adapters) concepts for TypeScript
- Community articles and examples for Node.js/TypeScript hexagonal structures