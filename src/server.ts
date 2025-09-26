import { urlencoded } from "body-parser";
import express from "express";
import { router } from "./routes/index";

const app = express();

app.use(urlencoded({ extended: true }));
app.disable("x-power-by");
app.use(express.json());
app.use(router);
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server run on http://localhost:${port}`);
});
