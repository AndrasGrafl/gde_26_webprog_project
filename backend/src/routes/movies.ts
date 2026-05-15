import { Router, Request, Response } from 'express';
import { db } from '../db';
import { movies, screenings } from '../db/schema';
import { eq } from 'drizzle-orm';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const allMovies = await db.select().from(movies);
    res.json(allMovies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

router.get('/:id/screenings', async (req: Request, res: Response): Promise<void> => {
  try {
    const movieId = parseInt(req.params.id as string);
    if (isNaN(movieId)) {
      res.status(400).json({ error: 'Invalid movie ID' });
      return;
    }

    const movieScreenings = await db.select()
      .from(screenings)
      .where(eq(screenings.movieId, movieId));
      
    res.json(movieScreenings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch screenings' });
  }
});

const movieSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  genre: z.string().min(1),
  durationMinutes: z.number().positive(),
  posterUrl: z.string().url().optional().or(z.literal('')),
});

router.post('/', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = movieSchema.parse(req.body);
    const newMovie = await db.insert(movies).values(validatedData).returning();
    res.status(201).json(newMovie[0]);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.issues });
    } else {
      res.status(500).json({ error: 'Failed to create movie' });
    }
  }
});

export default router;
