import express from 'express';
import cors from 'cors';

import formRoutes from './routes/form.routes';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/forms', formRoutes);
export default app;
