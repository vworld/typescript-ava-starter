import {Env} from "../types/environment.js";

const {node_env} = process.env;
if (!node_env || !["production", "development", "test"].includes(node_env)) {
    throw new Error(`NODE_ENV has incorrect value. '${node_env}'`);
}

// ADD more runtime checks here

const envs: Env = {
    NODE_ENV: node_env as Env['NODE_ENV']
}


export {envs}

