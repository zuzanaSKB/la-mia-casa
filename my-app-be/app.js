import express from 'express';
import session from "express-session";
import cors from 'cors';
import PgSession from 'connect-pg-simple';
import logger from 'morgan';
import pool from './config/db.js';
import { config } from './config/config.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import dotenv from 'dotenv';

dotenv.config();

const PgSessionStore = PgSession(session);
const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(
    session({
      store: new PgSessionStore({
        pool,
        tableName: 'session',
      }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      name: config.session.cookieName,
      cookie: {
        secure: process.env.STATUS === 'production',
        httpOnly: true,
        sameSite: process.env.STATUS === 'production' ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    })
  );



app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

app.get("/", (req, res) => {
    res.send("Server is running.")
})

export default app;
