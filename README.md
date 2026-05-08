# Visit Counter App

A simple Node.js + Express web app that displays a visit counter, hostname, and uptime. Includes Docker and Kubernetes manifests plus an Argo CD application for GitOps deployment.

## Features
- In-memory visit counter
- Health endpoint for probes
- Containerized with Docker
- Kubernetes Deployment + Service
- Argo CD Application for automated sync

## Endpoints
- `GET /` - HTML page with visit count, hostname, and uptime
- `GET /health` - JSON health check

## Run Locally
```bash
npm install
npm start
```
App listens on port 3000.

## Run with Docker
```bash
docker build -t visit-counter-app .
docker run -p 3000:3000 visit-counter-app
```

## Deploy to Kubernetes
```bash
kubectl apply -f k8s/deployment.yml
kubectl apply -f k8s/service.yml
```
Service is exposed as NodePort 30080.

## Deploy with Argo CD
```bash
kubectl apply -f argocd/deployment.yml
```
Argo CD will sync the manifests from the `k8s` folder in the configured Git repository.

## Flow Diagrams

### Architecture Flowcharts

#### 1. Runtime Request Path
```mermaid
flowchart TB
  classDef stage fill:#1f2937,stroke:#94a3b8,color:#e2e8f0,stroke-width:1px;
  classDef node fill:#0f172a,stroke:#38bdf8,color:#e2e8f0,stroke-width:1px;

  U[User Browser]:::node

  subgraph Stage1[Edge]
    Svc[Service: NodePort 30080]:::stage
  end

  subgraph Stage2[Cluster]
    Pod[Pod: visit-counter-app]:::stage
    App[Express App :3000]:::node
    Mem[In-memory Counter]:::node
    Sys[Hostname + Uptime]:::node
  end

  U --> Svc --> Pod --> App
  App --> Mem
  App --> Sys
  App -->|HTML Response| U
```

#### 2. GitOps Deployment Path (Argo CD + Kubernetes)
```mermaid
flowchart TB
  classDef stage fill:#1f2937,stroke:#94a3b8,color:#e2e8f0,stroke-width:1px;
  classDef node fill:#0f172a,stroke:#38bdf8,color:#e2e8f0,stroke-width:1px;

  Repo[Git Repo]:::node

  subgraph Stage1[Argo CD]
    ArgoApp[Application: visit-counter-app]:::stage
    Sync[Automated Sync]:::node
  end

  subgraph Stage2[Kubernetes]
    Deploy[Deployment]:::stage
    RS[ReplicaSet]:::stage
    Pods[Pods: 5 replicas]:::stage
    Service[Service: NodePort]:::stage
  end

  Repo --> ArgoApp --> Sync --> Deploy --> RS --> Pods
  Service --> Pods
```

#### 3. Container Build Path
```mermaid
flowchart TB
  classDef stage fill:#1f2937,stroke:#94a3b8,color:#e2e8f0,stroke-width:1px;
  classDef node fill:#0f172a,stroke:#38bdf8,color:#e2e8f0,stroke-width:1px;

  Src[Source: app.js + package.json]:::node

  subgraph Stage1[Docker Build]
    Base[Base Image: node:20-alpine]:::stage
    Install[npm install]:::node
    Copy[Copy Source]:::node
  end

  Img[Final Image]:::stage

  Src --> Base --> Install --> Copy --> Img
```

### Component Interconnections
```mermaid
flowchart LR
  Dev[Developer] --> Code[app.js + package.json]
  Code --> Docker[Dockerfile]
  Docker --> Image[Container Image]
  Image --> K8sManifests[k8s/*.yml]
  K8sManifests --> Cluster[Kubernetes Cluster]
  Cluster --> Service[Service: NodePort]
  Service --> Pod[Pod: visit-counter-app]
  Pod --> App[Express App]
```

### Request Flow
```mermaid
flowchart LR
  U[User Browser] --> Svc[K8s Service: NodePort 30080]
  Svc --> Pod[Visit Counter Pod]
  Pod --> App[Express App]
  App -->|HTML Response| U
```

### Health Probe Flow
```mermaid
flowchart LR
  Kubelet[Kubelet] -->|HTTP GET /health| Pod[Visit Counter Pod]
  Pod --> App[Express App]
  App -->|200 OK + uptime| Kubelet
```

### Kubernetes Control Flow
```mermaid
flowchart TD
  Git[Git Repo] --> Argo[Argo CD Application]
  Argo --> K8s[Kubernetes API]
  K8s --> Deploy[Deployment: visit-counter-app]
  Deploy --> RS[ReplicaSet]
  RS --> Pods[Pods: 5 replicas]
  K8s --> Svc[Service: NodePort]
  Svc --> Pods
```

### Local Dev Flow
```mermaid
flowchart LR
  Dev[Developer] --> Npm[npm start]
  Npm --> App[Express App :3000]
  Browser[Browser] -->|GET /| App
  App -->|HTML Response| Browser
```

## Project Structure
- app.js
- Dockerfile
- package.json
- k8s/
  - deployment.yml
  - service.yml
- argocd/
  - deployment.yml
