import bodyParser, { urlencoded } from "body-parser";
import express from "express";
import { MainRoutes } from "./routes/main";
import { authRoutes } from "./routes/auth";
import { adminRoutes } from "./routes/admin";
import cors from "cors";

const app = express();
app.use(cors());
app.use(urlencoded({ extended: true }));
app.disable("x-power-by");
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(MainRoutes);
app.use(authRoutes);
app.use(adminRoutes);
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server run on http://localhost:${port}`);
});
