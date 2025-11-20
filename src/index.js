import dotenv from "dotenv";
import express from "express";
import authRouter from "../routes/authRoutes.js";
import cors from "cors"

//Initialize the .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = ["http://localhost:5173"];

//middlewares
app.use(cors({ origin: allowedOrigins, Credential: true }));
app.use(express.json());


//Routes
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT: http://localhost:${PORT}`);
});
