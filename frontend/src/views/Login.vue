<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const email = ref('');
const password = ref('');
const isSubmitting = ref(false);

const handleLogin = async () => {
  isSubmitting.value = true;
  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error || 'Hibás bejelentkezési adatok.');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    toast.success('Sikeres bejelentkezés!');
    
    // Frissítjük az oldalt, hogy az App.vue computed propertyje érzékelje
    window.location.href = '/'; 
  } catch (error) {
    toast.error('Hiba történt a szerverrel való kommunikáció során.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-sm mt-10">
    <h2 class="text-2xl font-bold text-center mb-6">Bejelentkezés</h2>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email cím</label>
        <input type="email" id="email" v-model="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Jelszó</label>
        <input type="password" id="password" v-model="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      </div>
      <button type="submit" :disabled="isSubmitting" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
        {{ isSubmitting ? 'Bejelentkezés folyamatban...' : 'Belépés' }}
      </button>
    </form>
    <div class="mt-4 text-center">
      <p class="text-sm text-gray-600">Még nincs fiókod? <router-link to="/register" class="text-indigo-600 hover:text-indigo-500">Regisztrálj itt.</router-link></p>
    </div>
  </div>
</template>
