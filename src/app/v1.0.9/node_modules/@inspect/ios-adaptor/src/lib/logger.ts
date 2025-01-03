interface LoggerBase {
  error(...params: any[]): void;
  warn(...params: any[]): void;
  info(...params: any[]): void;
  debug(...params: any[]): void;
  log(...params: any[]): void;

  scope(name: string): LoggerBase;
}

class DefaultLogger implements LoggerBase {
  error(...params: any[]) {
    console.error(...params);
  }

  warn(...params: any[]) {
    console.warn(...params);
  }

  info(...params: any[]) {
    console.info(...params);
  }

  debug(...params: any[]) {
    console.debug(...params);
  }

  log(...params: any[]) {
    console.log(...params);
  }

  scope(name: string) {
    // TODO: Actually implement scoping
    return new DefaultLogger();
  }
}

export { DefaultLogger, LoggerBase };
