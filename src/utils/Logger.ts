import * as fs from "node:fs";
import path from "node:path";

import winston, {format, transports, Logger as WinstonLogger} from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import {LogOptions} from "../types/Logger.types.js";

import {LOG_LEVEL, LOG_RETENTION_DAYS} from "./env.js";

type LogMeta = (string | number | object)[];

export default class Logger {
    private logger: WinstonLogger;

    constructor(options: LogOptions = {}) {
        const {
            level = LOG_LEVEL,             // Default log level
            fileName,  // Default log file name
            logToConsole = false,        // Log to console by default
            logDirectory = 'logs/',     // Default log directory
            logRetentionDays,
            fileFormat = 'readable',         // Default log format (json)
            silent
        } = options;

        const logRetention = `${logRetentionDays ? logRetentionDays : (LOG_RETENTION_DAYS || 14)}d`;
        const logDirPath = path.join(process.cwd(), logDirectory);
        if (!fs.existsSync(logDirPath)) {
            fs.mkdirSync(logDirPath, {recursive: true});
        }

        const logFileName = fileName ? `${fileName}_${level}.log` : `${level}_%DATE%.log`;

        const timestampFormat = 'YYYY-MM-DD HH:mm:ss.SSS ZZ'

        const jsonFileTransport = new DailyRotateFile({
            filename   : logFileName,
            dirname    : logDirectory,
            datePattern: 'YYYY-MM-DD',
            maxFiles   : logRetention,
            level,
            silent,
            format     : format.combine(
                format.timestamp({format: timestampFormat}),
                format.json() // Save logs in JSON format
            )
        });

        const readableFileTransport = new DailyRotateFile({
            filename   : logFileName.replace('.log', '_readable.log'),
            dirname    : logDirectory,
            datePattern: 'YYYY-MM-DD',
            maxFiles   : logRetention,
            level,
            silent,
            format     : format.combine(
                format.timestamp({format: timestampFormat}),
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
                        filename   : `error_%DATE%.log`,
                        dirname    : logDirectory,
                        datePattern: 'YYYY-MM-DD',
                        maxFiles   : logRetention,
                        level      : 'error',
                        silent,
                        format     : format.combine(
                            format.timestamp({format: timestampFormat}),
                            format.json()
                        )
                    })
                );
            }

            if (fileFormat === 'readable' || fileFormat === 'both') {
                loggerTransports.push(new DailyRotateFile({
                    filename   : 'error_readable_%DATE%.log',
                    dirname    : logDirectory,
                    datePattern: 'YYYY-MM-DD',
                    maxFiles   : logRetention,
                    level      : 'error',
                    silent,
                    format     : format.combine(
                        format.timestamp({format: timestampFormat}),
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
                    silent,
                    format: format.combine(
                        format.colorize(),   // Colorize the output for console logs
                        format.timestamp({format: timestampFormat}),
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
                format.timestamp({format: timestampFormat}),
                format.errors({stack: true}), // Log stack traces
                format.splat()                   // Support string interpolation
            ),
            transports: loggerTransports,
        });
    }

    toggleLogging() {
        for (const transport of this.logger.transports) {
            transport.silent = !transport.silent;
        }
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
