import {LogLevels} from "../types/Logger.types.js";
import {Env} from "../types/environment.types.js";

const {node_env, LOG_LEVEL: LOG_LEVEL_ENV, LOG_RETENTION_DAYS: LOG_RETENTION_DAYS_ENV} = process.env;
if (!node_env || !["production", "development", "test"].includes(node_env)) {
    throw new Error(`NODE_ENV has incorrect value. '${node_env}'`);
}

// ADD more runtime checks here

const envs: Env = {
    NODE_ENV : node_env as Env['NODE_ENV'],
    LOG_LEVEL: LOG_LEVEL_ENV && isLogLevel(LOG_LEVEL_ENV) ? LOG_LEVEL_ENV : LogLevels.info,
    LOG_RETENTION_DAYS: LOG_RETENTION_DAYS_ENV && !isNaN(Number(LOG_RETENTION_DAYS_ENV)) ? Number(LOG_RETENTION_DAYS_ENV) : 14
}

function isLogLevel(value: string): value is LogLevels {
    return Object.values(LogLevels).includes(value as LogLevels);
}

export const {NODE_ENV, LOG_LEVEL, LOG_RETENTION_DAYS} = envs;
export {envs}


