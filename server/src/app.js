import express from "express";
import helmet from "helmet";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/auth.routes.js";
import todoRoutes from "./routes/todo.routes.js";
import cors from "cors";

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

app.use(notFound);
app.use(errorHandler);
export default app;
