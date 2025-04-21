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
import reservationRoutes from './routes/reservation.js'
import roomRoutes from './routes/room.js'
import reviewRoutes from './routes/review.js';
import birthdayDiscountRoutes from './routes/birthdayDiscount.js'
import dotenv from 'dotenv';

dotenv.config();

const PgSessionStore = PgSession(session);
const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(','),
  credentials: true
}));

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

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
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 
      },
    })
  );



app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reservation', reservationRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/birthdayDiscount', birthdayDiscountRoutes);

app.get("/", (req, res) => {
    res.send("Server is running.")
})

export default app;
