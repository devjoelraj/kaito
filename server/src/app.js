import express from "express";
import helmet from "helmet";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import todoRoutes from "./routes/todo.routes.js";
import cors from "cors";
import expenseRoutes from "./routes/expense.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

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
app.use("/expenses", expenseRoutes);
app.use("/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);
export default app;
