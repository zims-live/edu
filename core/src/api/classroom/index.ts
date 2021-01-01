import express, { Application, Response } from 'express';

const app: Application = express();

const PORT: string = process.env.PORT || "5000";

app.get('/', (_req, res: Response) => {
    res.send("Hello");
});

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
