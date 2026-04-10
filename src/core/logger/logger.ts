import { env } from '@config/env';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface LogEntry {
  level: Uppercase<LogLevel>;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

const LOG_LEVEL_WEIGHT: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4
};

function shouldLog(level: LogLevel, currentLevel: LogLevel): boolean {
  return LOG_LEVEL_WEIGHT[level] <= LOG_LEVEL_WEIGHT[currentLevel];
}

export class Logger {
  static currentLevel(): LogLevel {
    return env.logLevel;
  }

  static isDebugSession(): boolean {
    return (
      process.argv.includes('--debug') ||
      process.env.PWDEBUG === '1' ||
      LOG_LEVEL_WEIGHT[env.logLevel] >= LOG_LEVEL_WEIGHT.debug
    );
  }

  static createEntry(level: LogLevel, message: string, metadata?: Record<string, unknown>): LogEntry {
    return {
      level: level.toUpperCase() as Uppercase<LogLevel>,
      message,
      metadata,
      timestamp: new Date().toISOString()
    };
  }

  static write(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
    if (!shouldLog(level, this.currentLevel())) {
      return;
    }

    const serializedLog = JSON.stringify(this.createEntry(level, message, metadata));

    switch (level) {
      case 'error':
        console.error(serializedLog);
        break;
      case 'warn':
        console.warn(serializedLog);
        break;
      default:
        console.info(serializedLog);
        break;
    }
  }

  static error(message: string, metadata?: Record<string, unknown>): void {
    this.write('error', message, metadata);
  }

  static warn(message: string, metadata?: Record<string, unknown>): void {
    this.write('warn', message, metadata);
  }

  static info(message: string, metadata?: Record<string, unknown>): void {
    this.write('info', message, metadata);
  }

  static debug(message: string, metadata?: Record<string, unknown>): void {
    this.write('debug', message, metadata);
  }

  static trace(message: string, metadata?: Record<string, unknown>): void {
    this.write('trace', message, metadata);
  }
}

