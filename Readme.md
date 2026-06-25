# Todo List Microservices Application

A distributed Todo List application built with a modern microservices architecture.

## Tech Stack

- **Backend**: Go (Golang) microservices (Auth, User Profile, Task)
- **Frontend**: React + TypeScript + Vite
- **API Gateway**: Tyk Standalone Gateway
- **Databases**: MySQL (Relational), Redis (Caching/Session management)
- **Observability**: Prometheus & Grafana (Metrics collection & Dashboarding)

## Prerequisites

Ensure you have the following installed on your machine:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)

## Getting Started

1. Clone the repository and navigate to the project root directory.
2. Start all services using Docker Compose:
   ```bash
   docker compose up --build -d
   ```

## Port Mapping & Access Links

- **Frontend App**: [http://localhost](http://localhost) (Port `80`)
- **API Gateway**: [http://localhost:8080](http://localhost:8080)
- **Grafana Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Prometheus UI**: [http://localhost:9090](http://localhost:9090)
- **MySQL Database**: `localhost:3355` (User: `root`, Password: `root_password_secret_tcp`)
- **Redis Cache**: `localhost:6379`
