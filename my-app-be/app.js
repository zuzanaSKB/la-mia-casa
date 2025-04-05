import express from 'express';
import logger from 'morgan';
//import cors from "cors";
//app.use(cors());


const app = express();

app.use(logger('dev'));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running.")
})

export default app;
