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
    /**
     * Log Levels as specified by `npm`
     * Set the maximum level upto which events will be logged.
     * If not provided, the environment variable `LOG_LEVEL` is used.
     * And if env variable is absent or has incorrect string then `info` is used
     * */
    level?: LogLevels;
    /** Custom log file name (default: `${LOG_LEVEL}.log`) */
    fileName?: string;
    /** Whether to log to the console (default: `false`) */
    logToConsole?: boolean;
    /**
     * Directory name relative to project root, where log files will be saved (default: 'logs/').
     * It is better to keep all logs in one place.
     */
    logDirectory?: string;
    /**
     * Number of days after which logs will be auto deleted.
     * Use this to override the value set in environment variable `LOG_RETENTION_DAYS`.
     * Default is `14 days`
     */
    logRetentionDays?: number;
    /**
     * Log file format option
     *  - `readable` - format used is `${timestamp}: [ ${level} ] ${message}.\t[ ${JSON.stringify(meta || {})} ]`
     *  - `json` - format used is `format.json()` from `winston`. Aimed at being machine-readable
     *  - `both` - logs the same message to two separate files in readable and json format
     */
    fileFormat?: 'readable' | 'json' | 'both';
    /** Disable logging. (Default: `false`) */
    silent?: boolean;
}