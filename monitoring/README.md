# Monitoring

This folder contains tools to collect and visualize metrics from the Hackops API.

- **prometheus.yml**  
  Prometheus scrape configuration for:
  - `nestjs-app` at `http://api:8000/api/v1/metrics`
  - Prometheus self‑monitoring at `localhost:9090`
- **create-logs.sh**  
  Bash script to generate synthetic HTTP load against the API.


## Usage

1. Start your NestJS API (must expose `/api/v1/metrics`).
2. Launch Prometheus:
   ```bash
   docker run -d \
     --name prometheus \
     -p 9090:9090 \
     -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
     prom/prometheus
   ```
3. Generate load:
   ```bash
   chmod +x create-logs.sh
   ./create-logs.sh
   ```
4. Open Prometheus UI at <http://localhost:9090> and explore metrics.
