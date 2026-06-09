import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import notifysRouters from "./routes/notifyRoutes.js";
import configRoutes from "./routes/configRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(notifysRouters);
app.use(configRoutes);
app.use(statsRoutes);
app.use(healthRoutes);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`runing in port: ${port}`));
