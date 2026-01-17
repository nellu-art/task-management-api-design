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
│   │   │   └── tasks.service.ts  # Application service
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
│   └── interceptors/             # Logging interceptors
├── config/                       # Configuration
└── main.ts                       # Application entry point
```

## 🚀 Features

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
- **Validation**: class-validator, class-transformer
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
- **API Endpoints**: `http://localhost:3000/tasks`

You can configure the port via the `PORT` environment variable or by modifying `src/config/app.config.ts`.

### Environment Configuration

The application uses configuration from `src/config/app.config.ts`. You can modify the port and environment settings there.

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

### 4. Scalability

To handle task assignment notifications and other cross-cutting concerns, I would move from synchronous calls to an **Event-Driven Architecture**:

- **Message Broker**: RabbitMQ or Apache Kafka for event streaming
- **Event Types**: 
  - `TaskCreated`, `TaskUpdated`, `TaskDeleted`
  - `PersonAssigned`, `PersonUnassigned`
- **Decoupled Services**: 
  - Task service publishes events
  - Notification service subscribes to assignment events
  - Analytics service subscribes to all task events
  - Audit service logs all changes

This architecture would:
- Decouple the Task service from the Notification service
- Enable horizontal scaling of each service independently
- Provide resilience through message queuing
- Allow new services to subscribe to events without modifying existing code

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
- API versioning to manage breaking changes securely
- Request/response encryption for sensitive endpoints
- Implement request signing for critical operations
- Add request size limits to prevent DoS attacks

### 6. Additional Scalability Considerations

- **Pagination**: Add pagination to the "List Tasks" endpoint for large datasets
- **Database Connection Pooling**: Configure appropriate connection pools for production databases
- **Load Balancing**: Use load balancers (e.g., Nginx, AWS ALB) to distribute traffic across multiple instances
- **Horizontal Scaling**: Design stateless services to enable easy horizontal scaling
- **CDN**: For any static assets or API responses that can be cached
- **Compression**: Enable gzip/brotli compression for API responses to reduce bandwidth

## 📝 Development Notes

This MVP was built in 1 hour to demonstrate:
- Clean architecture principles
- Repository pattern implementation
- DTO validation
- Dependency injection
- Error handling
- Testing strategies

The codebase is intentionally minimal but follows best practices that can scale as requirements grow.

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
