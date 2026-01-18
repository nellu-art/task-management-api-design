# Tasks API - MVP Implementation

A RESTful API for managing tasks, built with NestJS following clean architecture principles. This MVP was developed in 1 hour to demonstrate core design patterns and architectural decisions.

## 🎯 Overview

This is a task management API that allows you to create, read, update, and delete tasks, as well as assign and unassign people to tasks. The application follows a layered architecture pattern with clear separation of concerns, making it easy to understand, test, and evolve.

## 🏗️ Architecture Decisions

### Why In-Memory Storage?
- **Fast development**: No database setup required
- **No external dependencies**: Simplifies deployment and testing
- **Easy to demonstrate patterns**: Focus on architecture, not infrastructure
- **Production**: Replace with real database (PostgreSQL, MongoDB, etc.)

### Why Layered Architecture?
- **Clear separation of concerns**: Presentation, Application, Domain, and Infrastructure layers
- **Easy to understand**: Each layer has a single responsibility
- **Scales well**: Suitable for small to medium applications
- **Can evolve to Clean Architecture**: Foundation is already in place

### Why These Patterns First?
- **Repository Pattern**: Most important for data abstraction - allows easy swapping of storage implementations
- **DTO Pattern**: Essential for validation and API contract definition
- **Dependency Injection**: Built into NestJS, provides free benefits for testability and maintainability

## 📁 Project Structure

```
src/
├── modules/
│   ├── tasks/
│   │   ├── application/          # Business logic layer
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── tasks.service.ts  # Application service
│   │   │   └── tasks.service.spec.ts  # Unit tests
│   │   ├── domain/               # Domain layer
│   │   │   ├── task.entity.ts    # Domain entity
│   │   │   └── task.repository.interface.ts  # Repository interface
│   │   ├── infrastructure/       # Infrastructure layer
│   │   │   └── in-memory-task.repository.ts  # In-memory implementation
│   │   ├── presentation/         # Presentation layer
│   │   │   └── tasks.controller.ts  # REST API controller
│   │   └── tasks.module.ts       # NestJS module
│   └── people/
│       └── domain/               # Person domain model (used for task assignment references)
├── common/                       # Shared utilities
│   ├── filters/                  # Exception filters
│   │   └── exception.filter.ts  # Global exception handler
│   └── interceptors/             # Logging interceptors
│       └── logging.interceptor.ts  # Request/response logging
├── config/                       # Configuration
│   ├── app.config.ts            # Application configuration factory
│   └── app.config.schema.ts     # Joi validation schema
├── app.module.ts                 # Root application module
└── main.ts                       # Application entry point
```

## 🚀 Features

### API Features
- ✅ **Swagger/OpenAPI Documentation**: Interactive API documentation with Swagger UI at `/api`
- ✅ **Global Exception Handling**: Centralized error handling with structured error responses
- ✅ **Request Logging**: Automatic logging of all incoming requests and responses
- ✅ **Input Validation**: Comprehensive DTO validation using class-validator
- ✅ **Configuration Management**: Type-safe configuration with environment variable validation
- ✅ **Error Stack Traces**: Configurable error stack traces (hidden in production)

### Task Management
- ✅ Create tasks with title, description, status, priority, and optional due date
- ✅ Get all tasks
- ✅ Get task by ID
- ✅ Update task
- ✅ Delete task
- ✅ Assign person to task
- ✅ Unassign person from task

### Task Properties
- **Status**: `TODO`, `IN_PROGRESS`, `DONE`, `BLOCKED`
- **Priority**: `LOW`, `MEDIUM`, `HIGH`, `URGENT`
- **Metadata**: Auto-generated `id`, `createdAt`, `updatedAt`
- **Assignment**: Multiple people can be assigned to a task

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | Get all tasks |
| `GET` | `/tasks/:id` | Get task by ID |
| `POST` | `/tasks` | Create a new task |
| `PUT` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task |
| `POST` | `/tasks/:id/assign` | Assign a person to a task |
| `POST` | `/tasks/:id/unassign` | Unassign a person from a task |

### Example Request

**Create Task:**
```bash
POST /tasks
Content-Type: application/json

{
  "title": "Implement user authentication",
  "description": "Add JWT-based authentication to the API",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2024-12-31T23:59:59Z"
}
```

**Assign Person:**
```bash
POST /tasks/{taskId}/assign
Content-Type: application/json

{
  "personId": "person-123"
}
```

## 🛠️ Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.7
- **Configuration**: @nestjs/config with Joi validation
- **Validation**: class-validator, class-transformer
- **API Documentation**: @nestjs/swagger (Swagger/OpenAPI)
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at:
- **Base URL**: `http://localhost:3000` (default port)
- **Tasks Endpoint**: `http://localhost:3000/tasks`
- **Swagger Documentation**: `http://localhost:3000/api` - Interactive API documentation with Swagger UI

### Environment Configuration

The application uses `@nestjs/config` for configuration management with environment variable validation.

**Setup:**
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure environment variables in `.env`:
   ```env
   NODE_ENV=development
   PORT=3000
   ```

**Available Environment Variables:**
- `NODE_ENV`: Application environment (`development`, `production`, `test`, or `prod`)
- `PORT`: Server port (default: `3000`, must be between 1-65535)

**Configuration Features:**
- ✅ Environment variable validation using Joi schema
- ✅ Type-safe configuration with TypeScript
- ✅ Automatic validation on application startup
- ✅ Default values for all configuration options
- ✅ Global configuration accessible via `ConfigService`

The configuration is defined in `src/config/app.config.ts` and validated using `src/config/app.config.schema.ts`.

## 🧪 Testing

```bash
# Unit tests
npm run test

# Unit tests in watch mode
npm run test:watch

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Test Coverage

The project includes comprehensive unit tests for the `TasksService` covering:
- Task CRUD operations
- Person assignment/unassignment
- Error handling (NotFoundException)
- Edge cases

E2E tests cover the main API endpoints to ensure integration works correctly.

## 🎨 Code Quality

```bash
# Format code
npm run format

# Lint code
npm run lint
```

## 🏛️ System Design & Scalability

### 1. Database Evolution

Currently using **In-Memory Storage** for fast development and demonstration purposes. For production, I would migrate to **PostgreSQL** for ACID compliance and relational data integrity.

**Database Indexing Strategy:**

Following best practices, I would start with minimal indexes and add them based on actual query patterns:

- **Primary Key Index** (automatic): On `id` for fast lookups by ID
- **Index on `status`**: Only if filtering by status becomes a common query pattern (e.g., "show me all IN_PROGRESS tasks")
- **GIN Index on `assignedPeople`**: Only if querying tasks by assignee becomes frequent (e.g., "show all tasks assigned to person X")

**Indexing Best Practices:**
- Avoid premature optimization - add indexes based on actual slow queries identified through monitoring
- Indexes have a cost: slower writes and additional storage
- Use PostgreSQL's `EXPLAIN ANALYZE` to identify queries that would benefit from indexes
- Consider composite indexes for multi-column queries (e.g., `(status, priority)` if filtering by both)

This approach ensures optimal performance without over-indexing, which can degrade write performance.

### 2. Caching Strategy

To handle high-read traffic on the "List Tasks" endpoint, I would implement **Redis Caching** with:
- **TTL of 5 minutes** for task lists
- **Cache invalidation** on Create/Update/Delete actions
- **Cache key strategy**: `tasks:all`, `tasks:status:{status}`, `tasks:assignee:{personId}`
- **Write-through cache** for individual task lookups by ID

This would reduce database load and improve response times for frequently accessed data.

### 3. Observability

I would integrate observability tools for production debugging:
- **Distributed Tracing**: Using OpenTelemetry or similar to trace requests across services
- **Centralized Logging**: ELK Stack (Elasticsearch, Logstash, Kibana) or similar for log aggregation
- **Metrics Collection**: Prometheus + Grafana for monitoring API performance, error rates, and business metrics
- **APM (Application Performance Monitoring)**: To identify bottlenecks and slow queries

This would enable debugging production issues across microservices and provide insights into system behavior.

### 4. Scalability Strategy

A **progressive scaling approach** is recommended, introducing complexity only when needed:

#### Phase 1: Monolithic Scaling (Current → Medium Scale)
For initial growth, scale the monolith:
- **Vertical Scaling**: Increase instance size (CPU, RAM) - simplest first step
- **Horizontal Scaling**: Multiple stateless instances behind load balancer
- **Database Optimization**: Add indexes, optimize queries, connection pooling
- **Caching**: Redis for frequently accessed data (see Caching Strategy above)
- **Expected Capacity**: 10K-100K requests/day
- **When**: Early to medium traffic, predictable patterns

#### Phase 2: Read Replicas (Medium → Large Scale)
When read traffic significantly exceeds write traffic:
- **Database Read Replicas**: Distribute read queries across replicas
- **Cache-Aside Pattern**: Cache frequently accessed data in Redis
- **CDN**: For static content if applicable
- **Expected Capacity**: 100K-1M requests/day
- **When**: Read-heavy workloads, geographic distribution needed

#### Phase 3: Event-Driven Architecture (Large → Very Large Scale)
When you need to decouple services and handle complex workflows:
- **Message Broker**: RabbitMQ (simpler, good for most cases) or Apache Kafka (high throughput, event streaming)
- **Event Types**: 
  - `TaskCreated`, `TaskUpdated`, `TaskDeleted`
  - `PersonAssigned`, `PersonUnassigned`
- **Decoupled Services**: 
  - Task service publishes events
  - Notification service subscribes to assignment events
  - Analytics service subscribes to all task events
  - Audit service logs all changes

**When to Introduce Event-Driven:**
- Multiple services need to react to task changes
- Need for eventual consistency across services
- Complex workflows (notifications, analytics, audit)
- High throughput requirements (millions of requests/day)
- **Note**: Not necessary for simple task management - only add when you have actual need for decoupling

**Benefits:**
- Decouple services for independent scaling
- Provide resilience through message queuing
- Allow new services to subscribe without modifying existing code
- Enable event sourcing and CQRS patterns if needed

### 5. Security Enhancements

For production deployment, I would implement comprehensive security measures:

**1. Security Headers (Helmet)**
- Implement `helmet` middleware to set secure HTTP headers
- Protect against common vulnerabilities (XSS, clickjacking, MIME-type sniffing)
- Configure Content Security Policy (CSP) headers

**2. CORS Configuration**
- Configure Cross-Origin Resource Sharing (CORS) properly
- Restrict allowed origins to known domains
- Enable credentials only when necessary
- Set appropriate preflight cache duration

**3. Rate Limiting**
- Implement API rate limiting using `@nestjs/throttler` to prevent abuse
- Configure different limits for authenticated vs anonymous users
- Set up rate limit headers for client awareness
- Implement IP-based and user-based throttling strategies

**4. Input Validation & Sanitization**
- Enhanced DTO validation with `class-validator` (already implemented)
- Input sanitization to prevent XSS attacks
- SQL injection prevention (when moving to database)
- File upload validation and scanning (if file attachments are added)

**5. Authentication & Authorization**
- JWT-based authentication for API access
- Role-based access control (RBAC) for different user permissions
- API key management for service-to-service communication
- OAuth2/OpenID Connect integration for third-party authentication

**6. Data Protection**
- Encrypt sensitive data at rest (database encryption)
- Use HTTPS/TLS for all communications
- Implement secure password hashing (bcrypt, Argon2) if user management is added
- PII (Personally Identifiable Information) masking in logs

**7. Security Monitoring**
- Implement security event logging
- Set up intrusion detection
- Monitor for suspicious patterns (brute force, unusual access patterns)
- Regular security audits and penetration testing

**8. API Security Best Practices**
- API versioning to manage breaking changes securely (can be added when needed)
- Request/response encryption for sensitive endpoints
- Implement request signing for critical operations
- Add request size limits to prevent DoS attacks

### 6. Additional Scalability Considerations

- **Pagination**: Add pagination to the "List Tasks" endpoint for large datasets (cursor-based or offset-based)
- **Database Connection Pooling**: Configure appropriate connection pools (e.g., 20-50 connections per instance)
- **Load Balancing**: Use load balancers (e.g., Nginx, AWS ALB) with health checks to distribute traffic
- **Stateless Design**: ✅ Already implemented - no session storage, enables easy horizontal scaling
- **CDN**: For any static assets or API responses that can be cached
- **Compression**: Enable gzip/brotli compression for API responses to reduce bandwidth
- **Health Checks**: Implement `/health` endpoint for load balancer and monitoring

## 📝 Development Notes

This MVP was built to demonstrate:
- **Clean Architecture**: Layered architecture with clear separation of concerns
- **Repository Pattern**: Data abstraction for easy storage implementation swapping
- **DTO Validation**: Input validation using class-validator
- **Dependency Injection**: NestJS built-in DI for testability and maintainability
- **Configuration Management**: Type-safe configuration with @nestjs/config
- **Error Handling**: Global exception filters with structured error responses
- **Testing Strategies**: Unit tests and E2E tests

The codebase is intentionally minimal but follows best practices that can scale as requirements grow.

### Configuration Architecture

The application uses NestJS's `ConfigModule` with the following features:
- **Namespaced Configuration**: Using `registerAs` pattern for organized config
- **Type Safety**: Full TypeScript support with `ConfigType` helper
- **Validation**: Joi schema validation at startup
- **Global Access**: Configuration available throughout the app via `ConfigService`
- **Caching**: Configuration values are cached for performance

## 🔄 Future Enhancements

- [ ] Add authentication and authorization
- [ ] Implement real database (PostgreSQL)
- [ ] Add pagination and filtering to list endpoints
- [ ] Implement soft deletes
- [ ] Add task search functionality
- [ ] Implement task dependencies
- [ ] Add task comments and activity logs
- [ ] Implement file attachments
- [ ] Add task templates
- [ ] Implement task recurring schedules

## 📄 License

This project is private and unlicensed.
