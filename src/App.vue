<script setup>
import { ref } from 'vue';
import Lessons from './components/Lessons.vue';
import Cart from './components/Cart.vue';

// Dummy data for the lessons
const lessons = ref([
  { _id: '1', topic: 'Math', location: 'Hendon', price: 100, space: 5, image: '/images/maths_school.jpg' },
  { _id: '2', topic: 'English', location: 'Colindale', price: 80, space: 5, image: '/images/english.jpg' },
  { _id: '3', topic: 'Physics', location: 'Brent Cross', price: 120, space: 5, image: '/images/physics.jpg' },
  { _id: '4', topic: 'Chemistry', location: 'Golders Green', price: 95, space: 5, image: '/images/chemistry.jpg' },
  { _id: '5', topic: 'Biology', location: 'Edgware', price: 110, space: 5, image: '/images/biology.jpg' },
  { _id: '6', topic: 'Art', location: 'Finchley', price: 75, space: 5, image: '/images/art.jpg' },
  { _id: '7', topic: 'History', location: 'Wembley', price: 90, space: 5, image: '/images/history.jpg' },
  { _id: '8', topic: 'Geography', location: 'Harrow', price: 85, space: 5, image: '/images/geography.jpg' },
  { _id: '9', topic: 'Music', location: 'Camden', price: 130, space: 5, image: '/images/music.png '},
  { _id: '10', topic: 'PE', location: 'Islington', price: 60, space: 5, image: '/images/pe.jpg' },
]);

const cart = ref([]);
const showLessons = ref(true);

const addedToCartMessage = ref('');
const messageTimeout = ref(null);
const messageProgress = ref(100);

function startMessageProgress() {
  const duration = 3000;
  const interval = 50;
  const decrement = (interval / duration) * 100;
  messageProgress.value = 100;

  if (messageTimeout.value) {
    clearInterval(messageTimeout.value);
  }

  messageTimeout.value = setInterval(() => {
    messageProgress.value -= decrement;
    if (messageProgress.value <= 0) {
      clearInterval(messageTimeout.value);
      addedToCartMessage.value = '';
    }
  }, interval);
}

function addToCart(lesson) {
  if (lesson.space > 0) {
    const cartItem = cart.value.find(item => item._id === lesson._id);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.value.push({ ...lesson, quantity: 1 });
    }
    lesson.space--;
    
    addedToCartMessage.value = `1 space for ${lesson.topic} added to cart!`;
    startMessageProgress();
  }
}

function removeFromCart(cartItem) {
  const index = cart.value.indexOf(cartItem);
  if (index > -1) {
    cart.value.splice(index, 1);
    const lesson = lessons.value.find(l => l._id === cartItem._id);
    if (lesson) {
      lesson.space += cartItem.quantity;
    }
  }
}

function checkout(orderDetails) {
    console.log('Order submitted:', orderDetails);
    cart.value = [];
}
</script>

<template>
  <div class="container-fluid bg-light min-vh-100">
    <header class="d-flex justify-content-between align-items-center bg-white p-3 shadow-sm sticky-top">
      <h1 class="h3 mb-0">Lessons</h1>
      <button class="btn btn-primary" @click="showLessons = !showLessons">
        <span v-if="showLessons">Show Cart ({{ cart.length }})</span>
        <span v-else>Back to Lessons</span>
      </button>
    </header>

    <main class="container py-4">
      <div v-if="addedToCartMessage" class="position-fixed top-0 start-50 translate-middle-x mt-3" style="z-index: 1050; width: auto; min-width: 300px; max-width: 90%;">
        <div class="alert alert-success d-flex align-items-center justify-content-between shadow" role="alert">
          <span>{{ addedToCartMessage }}</span>
          <button type="button" class="btn-close" @click="addedToCartMessage = ''" aria-label="Close"></button>
        </div>
        <div class="progress" style="height: 5px;">
          <div 
            class="progress-bar bg-success" 
            role="progressbar" 
            :style="{ width: messageProgress + '%' }" 
            aria-valuenow="100" 
            aria-valuemin="0" 
            aria-valuemax="100"
          ></div>
        </div>
      </div>
      <Lessons v-if="showLessons" :lessons="lessons" @addToCart="addToCart" />
      <Cart v-else :cart="cart" @removeFromCart="removeFromCart" @checkout="checkout" />
    </main>
  </div>
</template>