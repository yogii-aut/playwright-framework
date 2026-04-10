import { env } from '@config/env';
import { Logger, LogEntry, LogLevel } from '@src/core/logger/logger';

export class TestLogCollector {
  private readonly entries: LogEntry[] = [];

  log(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
    const entry = Logger.createEntry(level, message, metadata);
    this.entries.push(entry);
    Logger.write(level, message, metadata);
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    this.log('error', message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log('warn', message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log('info', message, metadata);
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', message, metadata);
  }

  trace(message: string, metadata?: Record<string, unknown>): void {
    this.log('trace', message, metadata);
  }

  shouldAttachToAllure(): boolean {
    return env.attachDebugLogsToAllure && Logger.isDebugSession();
  }

  hasEntries(): boolean {
    return this.entries.length > 0;
  }

  asText(): string {
    return this.entries
      .map((entry) => JSON.stringify(entry))
      .join('\n');
  }
}
