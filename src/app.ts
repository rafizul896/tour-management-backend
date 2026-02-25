import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes/indes";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    message: "Tour Management server is running..!",
  });
});

export default app;
