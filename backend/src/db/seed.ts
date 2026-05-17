import { db } from './index';
import { movies, screenings } from './schema';

async function seed() {
  try {
    console.log('Seeding started...');
    const existingMovies = await db.select({ id: movies.id }).from(movies).limit(1);
    if (existingMovies.length > 0) {
      console.log('Seed skipped: movies already exist.');
      process.exit(0);
      return;
    }
    const m = await db.insert(movies).values([
      { title: 'Dűne: Második Rész', description: 'Paul Atreides kalandja folytatódik az Arrakis bolygón.', genre: 'Sci-Fi', durationMinutes: 166, posterUrl: 'https://picsum.photos/seed/dune/500/750'}, 
      { title: 'Deadpool & Wolverine', description: 'A nagyszájú zsoldos és a morcos mutáns közös kalandja.', genre: 'Akció', durationMinutes: 127, posterUrl: 'https://picsum.photos/seed/deadpool/500/750'}
    ]).returning();
    
    await db.insert(screenings).values([
      { movieId: m[0].id, room: 'IMAX 1', availableSeats: 50, startTime: new Date(Date.now() + 86400000) }, 
      { movieId: m[1].id, room: 'Normál 2', availableSeats: 30, startTime: new Date(Date.now() + 172800000) }
    ]);
    console.log('Seed success');
  } catch (error) {
    console.error('Seed failed:', error);
  }
  process.exit(0);
}
seed();