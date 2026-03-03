import express from "express";
import cors from "cors";
import connectToMongoDb from "./db.js";

import productController from "./Controllers/ProductController.js";
import GameCatController from "./Controllers/GameCatController.js";
import CategoryController from "./Controllers/CategoryController.js";
import UserController from "./Controllers/UserController.js";
import trackController from "./Controllers/TrackRecordController.js";
import favController from "./Controllers/FavouriteController.js";
import blogsController from "./Controllers/BlogsController.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

/* ROUTES */
app.use("/api/gameCat", GameCatController);
app.use("/api/category", CategoryController);
app.use("/api/games", productController);
app.use("/api/user", UserController);
app.use("/api/track", trackController);
app.use("/api/fav", favController);
app.use("/api/blogs", blogsController);

/* ===========================
   LOCAL DEVELOPMENT
=========================== */

if (process.env.NODE_ENV !== "production") {
  const PORT = 8000;

  connectToMongoDb()
    .then(() => {
      console.log("MongoDB Connected (Local)");
      app.listen(PORT, () => {
        console.log(`Local server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("MongoDB Connection Error:", err);
    });
}

/* ===========================
   VERCEL (SERVERLESS)
=========================== */

if (process.env.NODE_ENV === "production") {
  app.use(async (req, res, next) => {
    try {
      await connectToMongoDb();
      next();
    } catch (error) {
      console.error("DB connection failed:", error);
      res.status(500).json({ message: "Database connection error" });
    }
  });
}

export default app;