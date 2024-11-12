import {LogLevels} from "./Logger.types.js";

export type Env = {
    NODE_ENV: 'production' | 'development' | 'test',
    LOG_LEVEL: LogLevels,
    LOG_RETENTION_DAYS: number;
}