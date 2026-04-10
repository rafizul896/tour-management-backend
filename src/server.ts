/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import seedSuperAdmin from "./app/utils/seedSuperAdmin";

let server: Server;

const main = async () => {
  try {
    await mongoose.connect(envVars.DB_URL as string);

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening port on ${envVars.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

(async () => {
  await main();
  await seedSuperAdmin();
})();

// unhandled, uncaught, signal termination error
process.on("unhandledRejection", (err) => {
  console.log("Form unhandleRejection", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Form uncaughtException", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGTERM", () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
