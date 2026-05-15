import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import moviesRoutes from './routes/movies';
import bookingsRoutes from './routes/bookings';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/movies', moviesRoutes);
app.use('/bookings', bookingsRoutes);

app.get('/', (req, res) => {
  res.send('API is running. Available endpoints: /auth, /movies, /bookings');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
