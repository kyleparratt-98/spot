"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_middleware_1 = require("./common/middleware/errorHandler.middleware");
const express_1 = __importDefault(require("express"));
const errors_1 = require("./common/errors");
const controllers_1 = __importDefault(require("./controllers"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.env = process.env.NODE_ENV || "development";
        this.port = process.env.PORT || 3000;
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    listen() {
        const options = { port: this.port };
        const expressServer = this.app.listen(options);
        //nginx uses a 650 second keep-alive timeout on GAE. Setting it to a bit more here to avoid a race condition between the two timeouts.
        expressServer.keepAliveTimeout = 700000;
        //ensure the headersTimeout is set higher than the keepAliveTimeout due to this nodejs regression bug: https://github.com/nodejs/node/issues/27363
        expressServer.headersTimeout = 701000;
        expressServer.on("listening", () => {
            console.info(`
        🚀 Server is running!
        🔉 Listening on port ${options.port}
        📭 Query at http://localhost:${options.port}
      `);
        });
        expressServer.on("error", (error) => {
            throw new errors_1.HttpException(500, error.message, error);
        });
    }
    getServer() {
        return this.app;
    }
    initializeMiddleware() {
        this.app.use(express_1.default.json({ limit: "50mb" }));
        this.app.use(express_1.default.urlencoded({
            limit: "50mb",
            parameterLimit: 100000,
            extended: true,
        }));
    }
    initializeRoutes() {
        this.app.use("/", controllers_1.default);
    }
    initializeErrorHandling() {
        this.app.use(errorHandler_middleware_1.errorMiddleware);
    }
}
exports.default = App;
