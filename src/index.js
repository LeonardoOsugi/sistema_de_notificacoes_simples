import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import notifysRouters from "./routes/notifyRoutes.js";
import configRoutes from "./routes/configRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(notifysRouters);
app.use(configRoutes);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`runing in port: ${port}`));