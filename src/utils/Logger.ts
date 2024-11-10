import * as fs from "node:fs";
import path from "node:path";

import winston, {format, transports, Logger as WinstonLogger} from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';


interface LoggerOptions {
    level?: string;                // Custom log level (e.g., 'info', 'error')
    fileName?: string;             // Custom log file name (default: `${level}.log`)
    logToConsole?: boolean;        // Whether to log to the console (default: true)
    logDirectory?: string;         // Directory where log files will be saved (default: 'logs/')
    fileFormat?: 'readable' | 'json' | 'both';  // Log file format option
}

type LogMeta = (string | number | object)[];

export default class Logger {
    private logger: WinstonLogger;

    constructor(options: LoggerOptions = {}) {
        const {
            level = 'info',             // Default log level
            fileName = `${level}.log`,  // Default log file name
            logToConsole = false,        // Log to console by default
            logDirectory = 'logs/',     // Default log directory
            fileFormat = 'json'         // Default log format (json)
        } = options;

        const logRetention = `${process.env.LOG_RETENTION_DAYS || 14}d`;
        const logDirPath = path.join(process.cwd(), logDirectory);
        if (!fs.existsSync(logDirPath)) {
            fs.mkdirSync(logDirPath, {recursive: true});
        }

        const jsonFileTransport = new DailyRotateFile({
            filename   : path.join(process.cwd(), logDirectory, fileName),
            datePattern: 'YYYY-MM-DD',
            maxFiles   : logRetention,                       // Keep logs for 14 days
            level,                                  // Use the provided log level
            format     : format.combine(
                format.timestamp(),
                format.json() // Save logs in JSON format
            )
        });

        const readableFileTransport = new DailyRotateFile({
            filename   : path.join(process.cwd(), logDirectory, fileName.replace('.log', '_readable.log')),
            datePattern: 'YYYY-MM-DD',
            maxFiles   : logRetention,                        // Keep logs for 14 days
            level,                                  // Use the provided log level
            format     : format.combine(
                format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                format.printf(({timestamp, level, message, ...meta}) => {
                    return `${timestamp}: [ ${level} ] ${message}.\t[ ${JSON.stringify(meta || {})} ]`;
                })
            )
        });

        const loggerTransports: winston.transport[] = [];

        // Add appropriate file transports based on fileFormat
        if (fileFormat === 'json') {
            loggerTransports.push(jsonFileTransport);
        } else if (fileFormat === 'readable') {
            loggerTransports.push(readableFileTransport);
        } else if (fileFormat === 'both') {
            loggerTransports.push(jsonFileTransport, readableFileTransport);
        }

        // Always log errors to a separate file unless the log level is already error
        if (level !== 'error') {

            if (fileFormat === 'json' || fileFormat === 'both') {
                loggerTransports.push(
                    new DailyRotateFile({
                        filename   : `${logDirectory}/error.log`,
                        datePattern: 'YYYY-MM-DD',
                        maxFiles   : '14d',
                        level      : 'error',
                        format     : format.combine(
                            format.timestamp(),
                            format.json()
                        )
                    })
                );
            }

            if (fileFormat === 'readable' || fileFormat === 'both') {
                loggerTransports.push(new DailyRotateFile({
                    filename   : path.join(process.cwd(), logDirectory, 'error_readable.log'),
                    datePattern: 'YYYY-MM-DD',
                    maxFiles   : logRetention,
                    level      : 'error',
                    format     : format.combine(
                        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                        format.printf(({timestamp, level, message, ...meta}) => {
                            return `${timestamp}: [ ${level} ] ${message}.\t[ ${JSON.stringify(meta || {})} ]`;
                        })
                    )
                }));
            }
        }

        // Optionally add console logging
        if (logToConsole) {
            loggerTransports.push(
                new transports.Console({
                    level,
                    format: format.combine(
                        format.colorize(),   // Colorize the output for console logs
                        format.printf(({timestamp, level, message, ...meta}) => {
                            return `${timestamp}: [ ${level} ] ${message}.\t[ ${JSON.stringify(meta || {})} ]`;
                        })
                    )
                })
            );
        }

        this.logger = winston.createLogger({
            level,
            format    : format.combine(
                format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                format.errors({stack: true}), // Log stack traces
                format.splat()                   // Support string interpolation
            ),
            transports: loggerTransports,
        });
    }

    // Log at 'info' level
    info(message: string, ...meta: LogMeta): void {
        this.logger.info(message, ...meta);
    }

    // Log at 'error' level
    error(message: string, ...meta: LogMeta): void {
        this.logger.error(message, ...meta);
    }

    // Log at 'warn' level
    warn(message: string, ...meta: LogMeta): void {
        this.logger.warn(message, ...meta);
    }

    // Log at 'debug' level
    debug(message: string, ...meta: LogMeta): void {
        this.logger.debug(message, ...meta);
    }

    // Custom log method for any level
    log(level: string, message: string, ...meta: LogMeta): void {
        this.logger.log(level, message, ...meta);
    }

    // Set the log level dynamically
    setLevel(level: string): void {
        this.logger.level = level;
    }
}
