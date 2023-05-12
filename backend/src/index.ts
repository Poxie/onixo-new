import express from 'express';
import dotenv from 'dotenv';

import auth from './routes/auth';

const app = express();
dotenv.config();

app.use(auth);

app.listen(process.env.PORT, () => console.log('running'));