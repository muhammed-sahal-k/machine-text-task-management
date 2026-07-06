

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import connection from "./Connection.js";
import Router from "./Router.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("Task Management API running");
});

app.use("/api", Router);

connection()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));