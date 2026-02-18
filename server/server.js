require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { sequelize } = require('./models');

const logger = require('./utils/logger');
const globalErrorHandler = require('./middleware/errorMiddleware');
const AppError = require('./utils/AppError');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const client = require('prom-client');

// Create a Registry which registers the metrics
const register = new client.Registry();
// Add a default label which is added to all metrics
register.setDefaultLabels({
    app: 'kiddoz-server'
});
// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

const app = express();
const PORT = process.env.PORT || 5001;

// 0) TRACING MIDDLEWARE (Very top to trace everything)
app.use((req, res, next) => {
    req.id = req.headers['x-request-id'] || Math.random().toString(36).substring(7);
    res.setHeader('X-Request-Id', req.id);
    next();
});

// 1) INFRASTRUCTURE ROUTES (Move to top to bypass heavy global middleware)
// Health Check Endpoint (Liveness)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Readiness Probe (Deep Check)
app.get('/ready', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.status(200).json({ status: 'READY', database: 'connected' });
    } catch (error) {
        res.status(503).json({ status: 'NOT_READY', database: 'disconnected', error: error.message });
    }
});

// Metrics Endpoint
app.get('/metrics', async (req, res, next) => {
    try {
        res.setHeader('Content-Type', register.contentType);
        res.send(await register.metrics());
    } catch (err) {
        next(err);
    }
});

// Set security HTTP headers
app.use(helmet());

// Compress all responses
app.use(compression());

// Limit requests from same API (Rate Limiting)
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));

// Prevent parameter pollution
app.use(hpp());

// CORS Configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id']
}));

// Use morgan for HTTP request logging, piped to winston
app.use(morgan('combined', { stream: { write: message => logger.http(message.trim()) } }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Static Frontend (Build stage copies to /public)
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/financials', require('./routes/financials'));
app.use('/api/care-tasks', require('./routes/careTasks'));
app.use('/api/parent', require('./routes/parentRoutes'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/superadmin', require('./routes/superadmin'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/incidents', require('./routes/incidents'));

// Catch-all for React SPA
app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ message: 'API Endpoint Not Found' });
    }
    const indexFile = path.join(publicPath, 'index.html');
    res.sendFile(indexFile, (err) => {
        if (err) {
            res.status(200).json({ message: 'KiddoZ API is running. Frontend build not found in /public.' });
        }
    });
});

// Handle Unhandled Routes (Simple 404)
app.use((req, res, next) => {
    const error = new Error(`Can't find ${req.originalUrl} on this server!`);
    error.statusCode = 404;
    next(error);
});

// Global Error Handler
app.use(globalErrorHandler);

// Database Connection & Server Start
let server;

if (require.main === module) {
    sequelize.sync({ force: false })
        .then(() => {
            logger.info('Database connected & synced');
            server = app.listen(PORT, () => {
                logger.info(`Server running on port ${PORT}`);
            });
        })
        .catch(err => {
            logger.error(`Database connection error: ${err.message}`);
        });
}

// Handle Uncaught Exceptions & Rejections
process.on('uncaughtException', err => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    process.exit(1);
});

process.on('unhandledRejection', err => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

// Graceful Shutdown
const gracefulShutdown = (signal) => {
    logger.info(`${signal} RECEIVED. Shutting down gracefully`);
    if (server) {
        server.close(() => {
            logger.info('💥 Process terminated!');
            // Close DB connection if needed
            sequelize.close().then(() => {
                logger.info('Database connection closed.');
                process.exit(0);
            });
        });
    } else {
        process.exit(0);
    }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;
