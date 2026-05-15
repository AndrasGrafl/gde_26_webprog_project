<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();

const name = ref('');
const email = ref('');
const password = ref('');
const isSubmitting = ref(false);

const handleRegister = async () => {
  isSubmitting.value = true;
  try {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.value, email: email.value, password: password.value }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.details) {
        toast.error(data.details[0].message || 'Validációs hiba történt.');
      } else {
        toast.error(data.error || 'Sikertelen regisztráció.');
      }
      return;
    }

    toast.success('Sikeres regisztráció! Most már bejelentkezhetsz.');
    router.push('/login');
  } catch (error) {
    toast.error('Hiba történt a szerverrel való kommunikáció során.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-sm mt-10">
    <h2 class="text-2xl font-bold text-center mb-6">Regisztráció</h2>
    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Teljes Név</label>
        <input type="text" id="name" v-model="name" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email cím</label>
        <input type="email" id="email" v-model="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Jelszó</label>
        <input type="password" id="password" v-model="password" required minlength="6" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
        <p class="mt-1 text-xs text-gray-500">A jelszónak legalább 6 karakternek kell lennie.</p>
      </div>
      <button type="submit" :disabled="isSubmitting" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
        {{ isSubmitting ? 'Regisztráció...' : 'Regisztrálok' }}
      </button>
    </form>
    <div class="mt-4 text-center">
      <p class="text-sm text-gray-600">Van már fiókod? <router-link to="/login" class="text-indigo-600 hover:text-indigo-500">Lépj be.</router-link></p>
    </div>
  </div>
</template>
