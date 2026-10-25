import { Controller, Get } from '@nestjs/common';

// DigitalOcean (and most hosting platforms) periodically hit a health-check
// URL to confirm the app is alive, restarting it if that check fails.
// Without this, the default check path ("/") would 404, since no route
// handles the bare root — which could cause the platform to think the app
// is unhealthy and restart it in a loop.
@Controller()
export class HealthController {
  @Get()
  health() {
    return { status: 'ok' };
  }
}
