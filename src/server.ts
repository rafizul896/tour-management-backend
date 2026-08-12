/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import seedSuperAdmin from "./app/utils/seedSuperAdmin";
import { connectRedis, redisClient } from "./app/config/redis.config";

let server: Server;

const startServer = async () => {
  try {
    // Connect MongoDB
    await mongoose.connect(envVars.DB_URL as string);
    console.log("MongoDB connected successfully");

    // Connect Redis
    await connectRedis();
    console.log("Redis connected successfully");

    // Seed Super Admin
    await seedSuperAdmin();

    // Start Express server
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  try {
    // Close HTTP server
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      console.log("HTTP server closed");
    }

    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");

    // Close Redis connection
    if (redisClient.isOpen) {
      await redisClient.quit();
      console.log("Redis connection closed");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejection
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);

  gracefulShutdown("UNHANDLED_REJECTION");
});

// Handle uncaught exception
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);

  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

// Handle termination signals
process.on("SIGTERM", () => {
  gracefulShutdown("SIGTERM");
});

process.on("SIGINT", () => {
  gracefulShutdown("SIGINT");
});

// Start application
startServer();
