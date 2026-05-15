<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-3xl font-extrabold text-gray-900 mb-8">Saját Foglalásaim</h2>

    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500 text-lg">Foglalások betöltése...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-md mb-6">
      {{ error }}
    </div>

    <div v-else-if="bookings.length === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <p class="text-gray-500 text-lg mb-4">Még nincsenek foglalásaid.</p>
      <router-link to="/" class="text-indigo-600 font-medium hover:text-indigo-500">Nézd meg a műsort és foglalj jegyet!</router-link>
    </div>

    <div v-else class="space-y-4">
      <div v-for="booking in bookings" :key="booking.bookingId" class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-4">
        <div class="w-full sm:w-32 h-40 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
          <img v-if="booking.posterUrl" :src="booking.posterUrl" :alt="booking.movieTitle" class="w-full h-full object-cover">
        </div>
        <div class="flex-1 flex flex-col justify-center">
          <h3 class="text-xl font-bold text-gray-900">{{ booking.movieTitle }}</h3>
          <p class="text-gray-600 mt-2"><strong>Terem:</strong> {{ booking.room }}</p>
          <p class="text-gray-600"><strong>Időpont:</strong> {{ new Date(booking.startTime).toLocaleString('hu-HU') }}</p>
          <div class="mt-4 flex items-center justify-between">
            <span class="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
              {{ booking.seatsBooked }} db jegy
            </span>
            <span class="text-xs text-gray-400">Lefoglalva: {{ new Date(booking.createdAt).toLocaleDateString('hu-HU') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Booking {
  bookingId: number;
  seatsBooked: number;
  createdAt: string;
  room: string;
  startTime: string;
  movieTitle: string;
  posterUrl: string | null;
}

const bookings = ref<Booking[]>([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    error.value = 'Nem vagy bejelentkezve.';
    loading.value = false;
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/bookings/my-bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('A szerver nem JSON választ küldött. Ellenőrizd, hogy fut-e a backend a 3000-es porton.');
    }

    if (!res.ok) throw new Error('Hiba történt a foglalások lekérdezésekor.');
    const data = await res.json();
    bookings.value = data;
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>
