const redis = require('redis');

let client = null;
let isConnected = false;

const initRedis = async () => {
    if (!process.env.REDIS_URL) {
        console.log('[REDIS] REDIS_URL not configured. Running in database-direct mode.');
        return;
    }
    try {
        const redisUrl = process.env.REDIS_URL;
        client = redis.createClient({
            url: redisUrl,
            socket: {
                connectTimeout: 3000,
                reconnectStrategy: (retries) => {
                    if (retries > 3) return new Error('Max retries reached');
                    return Math.min(retries * 500, 2000);
                }
            }
        });

        client.on('connect', () => {
            console.log('[REDIS] Connecting to Redis cache server...');
        });

        client.on('ready', () => {
            isConnected = true;
            console.log('[REDIS] Connected and ready for caching operations.');
        });

        client.on('error', (err) => {
            isConnected = false;
            console.warn('[REDIS] Cache warning/error (degraded to DB-only mode):', err.message);
        });

        await client.connect();
    } catch (err) {
        isConnected = false;
        console.warn('[REDIS] Failed to initialize Redis connection:', err.message);
    }
};

const get = async (key) => {
    if (!isConnected || !client) return null;
    try {
        const val = await client.get(key);
        return val ? JSON.parse(val) : null;
    } catch (err) {
        console.warn('[REDIS] Get error:', err.message);
        return null;
    }
};

const set = async (key, value, ttlSeconds = 60) => {
    if (!isConnected || !client) return false;
    try {
        await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
        return true;
    } catch (err) {
        console.warn('[REDIS] Set error:', err.message);
        return false;
    }
};

const del = async (key) => {
    if (!isConnected || !client) return false;
    try {
        await client.del(key);
        return true;
    } catch (err) {
        console.warn('[REDIS] Del error:', err.message);
        return false;
    }
};

const delPattern = async (pattern) => {
    if (!isConnected || !client) return false;
    try {
        const keys = await client.keys(pattern);
        if (keys && keys.length > 0) {
            await client.del(keys);
        }
        return true;
    } catch (err) {
        console.warn('[REDIS] DelPattern error:', err.message);
        return false;
    }
};

const isReady = () => isConnected;

module.exports = {
    initRedis,
    get,
    set,
    del,
    delPattern,
    isReady
};
