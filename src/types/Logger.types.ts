export enum LogLevels {
    error = "error",
    warn = "warn",
    info = "info",
    http = "http",
    verbose = "verbose",
    debug = "debug",
    silly = "silly",
}

export interface LogOptions {
    /** npm LogLevels. Default `info` */
    level?: LogLevels;
    /** Custom log file name (default: `${level}.log`) */
    fileName?: string;
    /** Whether to log to the console (default: `true`) */
    logToConsole?: boolean;
    /** Directory where log files will be saved (default: 'logs/') */
    logDirectory?: string;
    /** Log file format option */
    fileFormat?: 'readable' | 'json' | 'both';
    /** Disable logging. (Default: `false`) */
    silent?: boolean;
}