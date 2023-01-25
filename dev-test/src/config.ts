import { config as configEnv } from 'dotenv';

const envVariables = [
    'MONGO_INITDB_USER',
    'MONGO_INITDB_PWD',
    'MONGO_INITDB_DATABASE',
    'MONGO_HOST',
    'MONGO_PORT',
    'SESSION_KEY',
];

type cfgType = {
    mongoHost: string,
    mongoPort: number,
    mongoDatabase: string,
    mongoPassword: string,
    mongoUsername: string,
    sessionKey: string,
};

let cfg: cfgType;

configEnv({ path: '.testenv' });

envVariables.forEach(envVariable => {
    if (process.env[envVariable] === undefined) {
        throw new Error(`The following ENV variable is undefined ${envVariable}`);
    }
});

cfg = {
    mongoHost: process.env.MONGO_HOST!,
    mongoPort: Number(process.env.MONGO_PORT!),
    mongoDatabase: process.env.MONGO_INITDB_DATABASE!,
    mongoPassword: process.env.MONGO_INITDB_PWD!,
    mongoUsername: process.env.MONGO_INITDB_USER!,
    sessionKey: process.env.SESSION_KEY!,
};

export default cfg;