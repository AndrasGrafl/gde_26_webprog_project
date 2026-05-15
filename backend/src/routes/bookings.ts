import { Router, Response } from 'express';
import { db } from '../db';
import { bookings, screenings, movies } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const bookingSchema = z.object({
  screeningId: z.number().int().positive(),
  seatsBooked: z.number().int().positive().min(1).max(10),
});

router.get('/my-bookings', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    const myBookings = await db.select({
      bookingId: bookings.id,
      seatsBooked: bookings.seatsBooked,
      createdAt: bookings.createdAt,
      room: screenings.room,
      startTime: screenings.startTime,
      movieTitle: movies.title,
      posterUrl: movies.posterUrl
    })
      .from(bookings)
      .innerJoin(screenings, eq(bookings.screeningId, screenings.id))
      .innerJoin(movies, eq(screenings.movieId, movies.id))
      .where(eq(bookings.userId, userId))
      .orderBy(bookings.createdAt);
      
    res.json(myBookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const validatedData = bookingSchema.parse(req.body);

    const screeningResult = await db.select().from(screenings).where(eq(screenings.id, validatedData.screeningId)).limit(1);
    const screening = screeningResult[0];

    if (!screening) {
      res.status(404).json({ error: 'Screening not found' });
      return;
    }

    if (screening.availableSeats < validatedData.seatsBooked) {
      res.status(400).json({ error: 'Not enough available seats' });
      return;
    }

    await db.update(screenings)
      .set({ availableSeats: sql`${screenings.availableSeats} - ${validatedData.seatsBooked}` })
      .where(eq(screenings.id, validatedData.screeningId));

    const newBooking = await db.insert(bookings).values({
      userId,
      screeningId: validatedData.screeningId,
      seatsBooked: validatedData.seatsBooked,
    }).returning();

    res.status(201).json({ message: 'Booking successful', booking: newBooking[0] });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.issues });
    } else {
      res.status(500).json({ error: 'Failed to create booking' });
    }
  }
});

export default router;
