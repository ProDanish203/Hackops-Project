import { Injectable, OnModuleInit } from '@nestjs/common';
import { Counter, Gauge, Histogram, register } from 'prom-client';
import * as os from 'os';

@Injectable()
export class MetricsService implements OnModuleInit {
  // HTTP metrics
  private requestCounter: Counter;
  private errorCounter: Counter;
  private httpRequestDuration: Histogram;
  private activeConnections: Gauge;

  // resource metrics
  private cpuUsageGauge: Gauge;
  private memoryUsageGauge: Gauge;
  private processUptimeGauge: Gauge;

  constructor() {
    register.clear();
    register.setDefaultLabels({
      app: 'hackops-api',
    });
  }

  onModuleInit() {
    this.initRequestCounter();
    this.initErrorCounter();
    this.initHttpRequestDuration();
    this.initActiveConnections();
    this.initCpuUsageGauge();
    this.initMemoryUsageGauge();
    this.initProcessUptimeGauge();
    this.startResourceMonitoring();
  }

  private initRequestCounter() {
    this.requestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'endpoint', 'module', 'status_code'],
    });
    register.registerMetric(this.requestCounter);
  }

  private initErrorCounter() {
    this.errorCounter = new Counter({
      name: 'http_errors_total',
      help: 'Total number of HTTP errors',
      labelNames: ['method', 'endpoint', 'module', 'status_code'],
    });
    register.registerMetric(this.errorCounter);
  }

  private initHttpRequestDuration() {
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'endpoint', 'module'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    });
    register.registerMetric(this.httpRequestDuration);
  }

  private initActiveConnections() {
    this.activeConnections = new Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
      labelNames: ['module'],
    });
    register.registerMetric(this.activeConnections);
  }

  private initCpuUsageGauge() {
    this.cpuUsageGauge = new Gauge({
      name: 'cpu_usage_percentage',
      help: 'CPU usage percentage',
    });
    register.registerMetric(this.cpuUsageGauge);
  }

  private initMemoryUsageGauge() {
    this.memoryUsageGauge = new Gauge({
      name: 'memory_usage_bytes',
      help: 'Memory usage in bytes',
      labelNames: ['type'],
    });
    register.registerMetric(this.memoryUsageGauge);
  }

  private initProcessUptimeGauge() {
    this.processUptimeGauge = new Gauge({
      name: 'process_uptime_seconds',
      help: 'Process uptime in seconds',
    });
    register.registerMetric(this.processUptimeGauge);
  }

  private startResourceMonitoring() {
    setInterval(() => {
      this.updateCpuMetrics();
      this.updateMemoryMetrics();
      this.updateUptimeMetrics();
    }, 30000);
  }

  private updateCpuMetrics() {
    const cpuUsage = process.cpuUsage();
    const totalUsage = cpuUsage.user + cpuUsage.system;

    const cpuCount = os.cpus().length;
    const elapsedTime = 30;
    const totalAvailableMicros = elapsedTime * 1000000 * cpuCount;

    const totalPercent = (totalUsage / totalAvailableMicros) * 100;
    this.cpuUsageGauge.set(totalPercent);
  }

  private updateMemoryMetrics() {
    const memoryUsage = process.memoryUsage();

    this.memoryUsageGauge.set({ type: 'rss' }, memoryUsage.rss);
    this.memoryUsageGauge.set({ type: 'heapTotal' }, memoryUsage.heapTotal);
    this.memoryUsageGauge.set({ type: 'heapUsed' }, memoryUsage.heapUsed);
  }

  private updateUptimeMetrics() {
    this.processUptimeGauge.set(process.uptime());
  }

  incrementRequestCounter(
    method: string,
    endpoint: string,
    module: string,
    statusCode: number,
  ) {
    this.requestCounter.inc({
      method,
      endpoint,
      module,
      status_code: statusCode.toString(),
    });
  }

  incrementErrorCounter(
    method: string,
    endpoint: string,
    module: string,
    statusCode: number,
  ) {
    this.errorCounter.inc({
      method,
      endpoint,
      module,
      status_code: statusCode.toString(),
    });
  }

  observeHttpRequestDuration(
    method: string,
    endpoint: string,
    module: string,
    durationSec: number,
  ) {
    this.httpRequestDuration.observe({ method, endpoint, module }, durationSec);
  }

  incrementActiveConnections(module: string) {
    this.activeConnections.inc({ module });
  }

  decrementActiveConnections(module: string) {
    this.activeConnections.dec({ module });
  }

  setActiveConnections(module: string, count: number) {
    this.activeConnections.set({ module }, count);
  }

  getMetrics(): Promise<string> {
    return register.metrics();
  }

  getContentType(): string {
    return register.contentType;
  }
}
