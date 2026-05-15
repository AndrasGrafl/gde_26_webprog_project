<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const movieId = route.params.id as string;
const movie = ref<any>(null);
const screenings = ref<any[]>([]);
const isLoading = ref(true);

const isLoggedIn = computed(() => !!localStorage.getItem('token'));
const selectedScreening = ref<number | null>(null);
const ticketCount = ref<number>(1);
const isBooking = ref(false);

onMounted(async () => {
  try {
    // Film adatainak lekérése (egyelőre lekérjük az összeset, és megkeressük, a backend egyszerűsítése miatt)
    const moviesRes = await fetch('http://localhost:3000/movies');
    if (moviesRes.ok) {
      const allMovies = await moviesRes.json();
      movie.value = allMovies.find((m: any) => m.id === parseInt(movieId));
    }

    if (!movie.value) {
      toast.error('Nincs ilyen film');
      router.push('/');
      return;
    }

    // Vetítések lekérése
    const screenRes = await fetch(`http://localhost:3000/movies/${movieId}/screenings`);
    if (screenRes.ok) {
      screenings.value = await screenRes.json();
    }
  } catch (error) {
    console.error(error);
    toast.error('Hiba az adatok betöltésekor');
  } finally {
    isLoading.value = false;
  }
});

const handleBook = async () => {
  if (!selectedScreening.value) {
    toast.warning('Válassz ki egy időpontot először!');
    return;
  }
  
  if (!isLoggedIn.value) {
    toast.warning('A foglaláshoz be kell jelentkezned!');
    router.push('/login');
    return;
  }

  isBooking.value = true;
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        screeningId: selectedScreening.value,
        seatsBooked: ticketCount.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error || 'A foglalás nem sikerült.');
      return;
    }

    toast.success('Sikeres jegyfoglalás!');
    
    // Frissítjük a konkrét vetítés szabad helyeit a helyi state-ben
    const sc = screenings.value.find(s => s.id === selectedScreening.value);
    if(sc) sc.availableSeats -= ticketCount.value;

    selectedScreening.value = null;
    ticketCount.value = 1;
  } catch (error) {
    toast.error('Gond adódott a foglalás során.');
  } finally {
    isBooking.value = false;
  }
};

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
  <div v-if="isLoading" class="text-center py-20">
    <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
  </div>

  <div v-else-if="movie" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
    <div class="md:w-1/3 bg-gray-200 flex items-center justify-center relative min-h-[300px]">
      <img v-if="movie.posterUrl" :src="movie.posterUrl" :alt="movie.title" class="absolute inset-0 w-full h-full object-cover">
    </div>
    
    <div class="p-6 md:w-2/3 flex flex-col">
      <h1 class="text-3xl font-bold mb-2">{{ movie.title }}</h1>
      <div class="flex gap-2 mb-4">
        <span class="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">{{ movie.genre }}</span>
        <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{{ movie.durationMinutes }} perc</span>
      </div>
      <p class="text-gray-700 mb-8">{{ movie.description }}</p>

      <h2 class="text-xl font-bold border-b pb-2 mb-4">Vetítések</h2>
      
      <div v-if="screenings.length === 0" class="text-gray-500 mb-6">
        Nincs aktuális vetítés ehhez a filmhez.
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div v-for="sc in screenings" :key="sc.id" 
             @click="selectedScreening = sc.id"
             :class="['border p-4 rounded cursor-pointer transition relative', 
                      selectedScreening === sc.id ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'hover:border-indigo-300',
                      sc.availableSeats === 0 ? 'opacity-50 pointer-events-none' : '']">
          <div class="font-bold text-lg">{{ formatDate(sc.startTime) }}</div>
          <div class="text-sm text-gray-600 mt-1">Terem: {{ sc.room }}</div>
          <div class="text-sm mt-1" :class="sc.availableSeats > 10 ? 'text-green-600' : 'text-red-500'">Még {{ sc.availableSeats }} hely</div>
        </div>
      </div>

      <div class="mt-auto bg-gray-50 p-4 rounded border flex items-center gap-4 flex-wrap" v-if="screenings.length > 0">
        <div class="flex items-center gap-2">
          <label class="font-medium text-gray-700">Jegyek:</label>
          <select v-model="ticketCount" class="border rounded p-1" :disabled="!selectedScreening">
            <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
        <button @click="handleBook" :disabled="isBooking || !selectedScreening" 
          class="ml-auto bg-indigo-600 text-white px-6 py-2 rounded font-medium hover:bg-indigo-700 disabled:opacity-50 transition">
          {{ isBooking ? 'Foglalás...' : 'Kiválasztott jegyek foglalása' }}
        </button>
      </div>
    </div>
  </div>
</template>
