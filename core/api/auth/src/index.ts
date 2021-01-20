import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import auth from "./routes/auth";

const app: Application = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

app.use("/auth", auth);

const PORT: string = process.env.PORT || "5000";
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
