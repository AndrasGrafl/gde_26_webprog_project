import { pgTable, serial, varchar, text, integer, timestamp, date, time } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const movies = pgTable('movies', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  genre: varchar('genre', { length: 150 }).notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  posterUrl: varchar('poster_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const screenings = pgTable('screenings', {
  id: serial('id').primaryKey(),
  movieId: integer('movie_id').references(() => movies.id).notNull(),
  room: varchar('room', { length: 100 }).notNull(),
  startTime: timestamp('start_time').notNull(),
  availableSeats: integer('available_seats').notNull(),
});

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  screeningId: integer('screening_id').references(() => screenings.id).notNull(),
  seatsBooked: integer('seats_booked').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
