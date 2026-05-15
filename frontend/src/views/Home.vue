<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  durationMinutes: number;
  posterUrl: string | null;
}

const movies = ref<Movie[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/movies');
    if (response.ok) {
      movies.value = await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch movies:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Aktuális Műsor</h1>
    
    <div v-if="isLoading" class="text-center py-10">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
      <p class="mt-2 text-gray-500">Filmek betöltése...</p>
    </div>
    
    <div v-else-if="movies.length === 0" class="text-center py-10">
      <p class="text-gray-500 text-lg">Jelenleg nincs egyetlen film sem műsoron.</p>
    </div>
    
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="movie in movies" :key="movie.id" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div class="h-64 bg-gray-200 flex items-center justify-center overflow-hidden relative">
          <img v-if="movie.posterUrl" :src="movie.posterUrl" :alt="movie.title" class="absolute w-full h-full object-cover">
          <span v-else class="text-gray-400">Nincs borítókép</span>
        </div>
        <div class="p-4 flex-1 flex flex-col">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-bold text-gray-900 leading-tight">{{ movie.title }}</h3>
          </div>
          <p class="text-sm border border-indigo-100 bg-indigo-50 text-indigo-800 px-2 py-1 rounded w-max mb-3">{{ movie.genre }} • {{ movie.durationMinutes }} perc</p>
          <p class="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{{ movie.description }}</p>
          <router-link :to="`/movie/${movie.id}`" class="block w-full text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition font-medium">Vetítések & Foglalás</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
