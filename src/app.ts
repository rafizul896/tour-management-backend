import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookirParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport";
import { envVars } from "./app/config/env";

const app = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for from data
app.use(cookirParser());
app.use(passport.initialize());
app.use(passport.session());
app.set("trust proxy", 1);
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  }),
);

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    environment: envVars.NODE_ENV,
    message: "Tour Management server is running..!",
    uptime: process.uptime().toFixed(2),
    timeStamp: new Date().toLocaleString(),
  });
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
