import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime();

    let module = 'unknown';
    const path = req.path.toLowerCase();

    if (path.includes('/auth')) {
      module = 'auth';
    } else if (path.includes('/users')) {
      module = 'users';
    } else if (path.includes('/products')) {
      module = 'product';
    } else if (path.includes('/category')) {
      module = 'category';
    }

    this.metricsService.incrementActiveConnections(module);

    res.on('finish', () => {
      const diff = process.hrtime(start);
      const duration = diff[0] + diff[1] / 1e9;

      const statusCode = res.statusCode;
      const method = req.method;
      const endpoint = req.route?.path || req.path;

      this.metricsService.incrementRequestCounter(
        method,
        endpoint,
        module,
        statusCode,
      );

      this.metricsService.observeHttpRequestDuration(
        method,
        endpoint,
        module,
        duration,
      );

      if (statusCode >= 400) {
        this.metricsService.incrementErrorCounter(
          method,
          endpoint,
          module,
          statusCode,
        );
      }

      this.metricsService.decrementActiveConnections(module);
    });

    next();
  }
}
