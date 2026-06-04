import express from "express";
import helmet from "helmet";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

const app = express();
app.use(helmet());

app.use(express.json());

app.use(notFound);
app.use(errorHandler);
export default app;
