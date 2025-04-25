import { Controller, Get, Header, Res } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Get application metrics in Prometheus format' })
  @ApiResponse({
    status: 200,
    description: 'Returns application metrics in Prometheus format',
  })
  async getMetrics(@Res() response: Response): Promise<void> {
    const metrics = await this.metricsService.getMetrics();
    response.set('Content-Type', this.metricsService.getContentType());
    response.send(metrics);
  }
}
