import app from "./app.js";
import { connectDb } from "./config/db.config.js";

const PORT = process.env.PORT || 3000;

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
});

connectDb();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
