import { errorMiddleware } from "./common/middleware/errorHandler.middleware";
import express from "express";
import { HttpException } from "./common/errors";
import router from "./controllers";

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor() {
    this.app = express();
    this.env = process.env.NODE_ENV || "development";
    this.port = process.env.PORT || 3000;

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  public listen(): void {
    const options = { port: this.port };
    const expressServer = this.app.listen(options);

    //nginx uses a 650 second keep-alive timeout on GAE. Setting it to a bit more here to avoid a race condition between the two timeouts.
    expressServer.keepAliveTimeout = 700000;

    //ensure the headersTimeout is set higher than the keepAliveTimeout due to this nodejs regression bug: https://github.com/nodejs/node/issues/27363
    expressServer.headersTimeout = 701000;

    expressServer.on("listening", () => {
      console.info(
        `
        🚀 Server is running!
        🔉 Listening on port ${options.port}
        📭 Query at http://localhost:${options.port}
      `
      );
    });

    expressServer.on("error", (error: Error) => {
      throw new HttpException(500, error.message, error);
    });
  }

  public getServer(): express.Application {
    return this.app;
  }

  private initializeMiddleware(): void {
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(
      express.urlencoded({
        limit: "50mb",
        parameterLimit: 100000,
        extended: true,
      })
    );
  }

  private initializeRoutes(): void {
    this.app.use("/", router);
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }
}

export default App;