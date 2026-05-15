<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const isLoggedIn = computed(() => {
  return !!localStorage.getItem("token");
});

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 text-gray-900 font-sans">
    <nav class="bg-indigo-600 text-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex-shrink-0">
            <router-link to="/" class="text-2xl font-bold tracking-tight">KockaMozi</router-link>
          </div>
          <div class="flex space-x-4">
            <router-link to="/" class="hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">Filmek</router-link>
            <template v-if="!isLoggedIn">
              <router-link to="/login" class="hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">Belépés</router-link>
              <router-link to="/register" class="bg-indigo-500 hover:bg-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Regisztráció</router-link>
            </template>
            <template v-else>
              <router-link to="/my-bookings" class="hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">Foglalásaim</router-link>
              <button @click="logout" class="hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">Kijelentkezés</button>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full block">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
</style>
