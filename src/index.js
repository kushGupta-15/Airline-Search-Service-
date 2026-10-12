const express = require("express");
const crypto = require("crypto");
const helmet = require("helmet");
const cors = require("cors");
const { PORT } = require("./config/serverConfig.js");
const ApiRoutes = require('./routes/index.js');
const db = require("./models/index.js");
const cache = require("./utils/cache.js");

const setupAndStartServer = async () => {
  const app = express();

  app.use(helmet());
  app.use(cors());

  // Distributed Tracing: Correlation ID Middleware
  app.use((req, res, next) => {
    const correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
    req.correlationId = correlationId;
    res.setHeader('x-correlation-id', correlationId);

    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[TRACING] [${correlationId}] ${req.method} ${req.originalUrl || req.url} - ${res.statusCode} (${duration}ms)`);
    });
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  // Initialize Redis Cache
  await cache.initRedis();

  app.use('/api', ApiRoutes);

  app.get('/health', async (req, res) => {
    try {
      await db.sequelize.authenticate();
      return res.status(200).json({
        service: 'Airline-Search-Service-',
        status: 'UP',
        database: 'CONNECTED',
        cache: cache.isReady() ? 'CONNECTED' : 'DISCONNECTED',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(503).json({
        service: 'Airline-Search-Service-',
        status: 'DEGRADED',
        database: 'DISCONNECTED',
        cache: cache.isReady() ? 'CONNECTED' : 'DISCONNECTED',
        error: error.message
      });
    }
  });

  app.get('/metrics', (req, res) => {
    const memory = process.memoryUsage();
    return res.status(200).json({
      service: 'Airline-Search-Service-',
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      memory: {
        rssMb: +(memory.rss / (1024 * 1024)).toFixed(2),
        heapTotalMb: +(memory.heapTotal / (1024 * 1024)).toFixed(2),
        heapUsedMb: +(memory.heapUsed / (1024 * 1024)).toFixed(2)
      },
      cache: {
        status: cache.isReady() ? 'READY' : 'OFFLINE'
      },
      nodeVersion: process.version
    });
  });

  app.listen(PORT, async () => {
    console.log(`Server is running at port ${PORT}`);
    // await City.create({
    //   name: "New Delhi"
    // })

    // const repo = new CityRepository();
    // repo.deleteCity(1); 
    
    // if(process.env.SYNC_DB) {
    //   db.sequelize.sync({alter: true});
    // }
  });
};

setupAndStartServer();