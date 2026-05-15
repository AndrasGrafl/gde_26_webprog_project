import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import MovieDetails from '../views/MovieDetails.vue';
import MyBookings from '../views/MyBookings.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    { path: '/movie/:id', name: 'MovieDetails', component: MovieDetails },
    { path: '/my-bookings', name: 'MyBookings', component: MyBookings },
  ],
});

export default router;
