import CORS from 'cors';
import express from 'express';
import dotenv from 'dotenv';

import auth from './routes/auth';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(CORS({ origin: 'http://localhost:3000' }));
dotenv.config();

app.use(auth);

app.listen(process.env.PORT, () => console.log('running'));