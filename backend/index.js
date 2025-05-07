import { PORT, mongoDBURL } from "./config.js";
import express from "express";
import mongoose from "mongoose";
import blogRoutes from "./routes/blogRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/blogs", blogRoutes);
app.use("/users", userRoutes);

app.get("/", (request, response) => {
  return response.status(200).send("Server is running on port 5555");
});

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("db connected");
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
