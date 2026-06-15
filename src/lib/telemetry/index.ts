export interface TelemetryEvent {
  event: string;
  category: 'api' | 'validation' | 'render' | 'contract' | 'general';
  level: 'info' | 'warn' | 'error';
  message: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

class TelemetrySystem {
  private logs: TelemetryEvent[] = [];

  log(
    category: TelemetryEvent['category'],
    level: TelemetryEvent['level'],
    message: string,
    metadata?: Record<string, any>
  ) {
    const event: TelemetryEvent = {
      event: `${category.toUpperCase()}_${level.toUpperCase()}`,
      category,
      level,
      message,
      metadata,
      timestamp: new Date().toISOString(),
    };
    
    if (level === 'error') {
      console.error(`[Telemetry ERROR] [${category}] ${message}`, metadata);
    } else if (level === 'warn') {
      console.warn(`[Telemetry WARN] [${category}] ${message}`, metadata);
    } else {
      console.log(`[Telemetry INFO] [${category}] ${message}`, metadata);
    }
    
    this.logs.push(event);
    
    if (this.logs.length > 500) {
      this.logs.shift();
    }
  }

  getLogs() {
    return this.logs;
  }
}

export const telemetry = new TelemetrySystem();
