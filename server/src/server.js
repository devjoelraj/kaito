import app from "./app.js";
import { connectDb } from "./config/db.config.js";

const PORT = process.env.PORT || 3000;

connectDb();

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
