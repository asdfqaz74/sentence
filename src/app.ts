import cors from "cors";
import morgan from "morgan";
import express, { Express, Request, Response } from "express";
import routes from "./routes/index";

const app: Express = express();

// Middleware
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

app.use("/api", routes);

export default app;
