# E-Commerce Inventory Management System

A comprehensive inventory management system for e-commerce store administrators with product management, order tracking, and dashboard analytics.

## Core Features

- 🔐 **Authentication & Authorization** using JWT tokens and secure cookie storage
- 📦 **Product Management** with complete CRUD operations
- 🗂️ **Category Management** with CRUD functionality
- 📊 **Order Tracking & Management**
- 📈 **Admin Dashboard** with key metrics

## Tech Stack

### Frontend

- NextJS
- Tailwind CSS
- Shadcn UI Components

### Backend

- NestJS
- PostgreSQL
- Prisma ORM

## DevOps Architecture

Our project showcases a complete DevOps implementation that creates a complete end-to-end solution where developers can focus solely on writing code while the infrastructure handles everything else. We've built a production-ready system that automates deployment, testing, monitoring, and security, eliminating operational overhead and creating a true "push and forget" development experience. The architecture includes:

### Containerization

- Separate Dockerfiles for frontend and backend services
- Docker Compose for orchestrating the entire application stack
- Containerized database with data persistence

### Monitoring Stack

- **Prometheus** for metrics collection and alerting
- **Grafana** for visualization dashboards and monitoring
- Configured persistent storage for monitoring data
- Inter-service network communication

### Testing

- Comprehensive Jest unit tests for all backend modules

### CI/CD Pipeline (GitHub Actions)

1. **CI Pipeline**: Automated testing on every pull request
2. **Build Pipeline**: Automatic Docker image builds for frontend and backend on main branch pushes
3. **Deployment Pipeline**: Automatic deployment to VPS using GitHub Action runners

### Production Environment

- Deployed on Digital Ocean Droplet
- **Nginx** configured as reverse proxy with rate limiting
- Optimized server configuration for production workloads

## Getting Started

### Local Development

```bash
# Clone the repository
git clone https://github.com/ProDanish203/Hackops-Project.git
cd Hackops-Project

# Start the development environment
docker compose up -d --build
```

### Accessing Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Grafana**: http://localhost:3001
- **Prometheus**: http://localhost:9090

## Project Structure

```
├── client/             # NextJS frontend
│   ├── Dockerfile      # Frontend container definition
    ├── src/            # Code for frontend
│   └── ...
├── server/             # NestJS backend
│   ├── Dockerfile      # Backend container definition
    ├── src/            # API source code
│   └── ...
├── monitoring/             # Monitoring
│   └── prometheus.yml      # configuration file for prometheus
│
├── .github/                # GitHub Action workflows
│   └── workflows/
│       ├── build-and-test.yaml          # Testing pipeline
│       ├── deploy-to-vps.yaml           # Docker build pipeline
│       └── push-to-docker.yaml          # Deployment pipeline
├── compose.yml                         # Service orchestration for Docker
└── nginx.conf                          # Nginx configuration
```

## DevOps Flow

1. Code changes pushed to GitHub
2. GitHub Actions run automated tests
3. On merge or push to main, Docker images are built and pushed to DockerHub registry
4. Deployment action pulls latest images and runs docker-compose on VPS
5. Nginx handles incoming requests with rate limiting
6. Prometheus collects metrics from all services
7. Grafana provides visualization and monitoring dashboards by using prometheus as the data source.

### Accessing Services (Production)

- **Frontend**: http://159.89.162.126/
- **Backend API**: http://159.89.162.126/api/v1
- **Grafana**: http://159.89.162.126:3001
- **Prometheus**: http://159.89.162.126:9090
- **Docker Image (Client)**: https://hub.docker.com/repository/docker/prodanish203/hackops-client/general
- **Docker Image (Backend)**: https://hub.docker.com/repository/docker/prodanish203/hackops-server/general

## Infrastructure & Application Screenshots

### System Architecture

![System Architecture Diagram](./images/infra.png)
![System Architecture Diagram](./images/infra2.png)

### DevOps Components
#### Grafana Dashboard
![Grafana Monitoring Dashboard](./images/dashboard-1.png)
![Grafana Monitoring Dashboard](./images/dashboard-2.png)
![Grafana Monitoring Dashboard](./images/dashboard-3.png)
#### Prometheus Dashboard
![Prometheus Metrics](./images/prometheus-dashboard.png)
#### Raw Metrics from API
![Raw Metrics](./images/raw-metrics.png)

<!-- ![CI/CD Pipeline](./images/pipeline.png) -->

### Application UI

![Login Page](./images/login-page.png)

####

---

_Built for the Hackops'25_
