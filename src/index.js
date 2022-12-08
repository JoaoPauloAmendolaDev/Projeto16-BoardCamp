import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connection from "./server.js";
import categoriesRouter from "./routes/categories.routes.js";
import gamesRouter from "./routes/games.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(categoriesRouter);
app.use(gamesRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server running in port ${port}`));
