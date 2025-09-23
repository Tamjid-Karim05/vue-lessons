<script setup>
import { ref } from 'vue';
import Lessons from './components/Lessons.vue';

const lessons = ref([
  { _id: '1', topic: 'Math', location: 'Hendon', price: 100, space: 5, image: 'https://placehold.co/100x100?text=Math' },
  { _id: '2', topic: 'English', location: 'Colindale', price: 80, space: 5, image: 'https://placehold.co/100x100?text=English' },
  { _id: '3', topic: 'Physics', location: 'Brent Cross', price: 120, space: 5, image: 'https://placehold.co/100x100?text=Physics' },
  { _id: '4', topic: 'Chemistry', location: 'Golders Green', price: 95, space: 5, image: 'https://placehold.co/100x100?text=Chem' },
  { _id: '5', topic: 'Biology', location: 'Edgware', price: 110, space: 5, image: 'https://placehold.co/100x100?text=Bio' },
  { _id: '6', topic: 'Art', location: 'Finchley', price: 75, space: 5, image: 'https://placehold.co/100x100?text=Art' },
  { _id: '7', topic: 'History', location: 'Wembley', price: 90, space: 5, image: 'https://placehold.co/100x100?text=History' },
  { _id: '8', topic: 'Geography', location: 'Harrow', price: 85, space: 5, image: 'https://placehold.co/100x100?text=Geo' },
  { _id: '9', topic: 'Music', location: 'Camden', price: 130, space: 5, image: 'https://placehold.co/100x100?text=Music' },
  { _id: '10', topic: 'PE', location: 'Islington', price: 60, space: 5, image: 'https://placehold.co/100x100?text=PE' },
]);
const cart = ref([]);

function addToCart(lesson) {
  if (lesson.space > 0) {
    const cartItem = cart.value.find(item => item._id === lesson._id);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.value.push({ ...lesson, quantity: 1 });
    }
    lesson.space--;
  }
}
</script>

<template>
  <div class="container-fluid bg-light min-vh-100">
    <header class="d-flex justify-content-between align-items-center bg-white p-3 shadow-sm sticky-top">
      <h1 class="h3 mb-0">Lessons</h1>
    </header>
    <main class="container py-4">
      <Lessons :lessons="lessons" @addToCart="addToCart" />
    </main>
  </div>
</template>