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

const cart = ref([]); //
const showLessons = ref(true); //

const addedToCartMessage = ref(''); //
const messageTimeout = ref(null); //
const messageProgress = ref(100); //

// Starts the progress bar for the "Added to Cart" message
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

// Adds a lesson to the cart or increments its quantity
function addToCart(lesson) {
  if (lesson.space > 0) {
    const cartItem = cart.value.find(item => item._id === lesson._id);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.value.push({ ...lesson, quantity: 1 });
    }
    lesson.space--;
    
    addedToCartMessage.value = `${lesson.topic} was added to your cart!`;
    startMessageProgress();
  }
}

// Removes an item completely from the cart
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

// Clears the cart after checkout
function checkout(orderDetails) {
    console.log('Order submitted:', orderDetails);
    
    // Reset spaces for all items that were in the cart
    cart.value.forEach(cartItem => {
        const lesson = lessons.value.find(l => l._id === cartItem._id);
        if (lesson) {
            lesson.space += cartItem.quantity;
        }
    });

    cart.value = [];
}
</script>

<template>
  <div id="app-container">
    <header class="app-header">
      <div class="container d-flex justify-content-between align-items-center">
        <h1 class="h3 mb-0 fw-bold">Lesson Shop</h1>
        <button class="btn btn-outline-primary" @click="showLessons = !showLessons">
          <span v-if="showLessons">
            <i class="bi bi-cart-fill me-1"></i> Cart ({{ cart.length }})
          </span>
          <span v-else>
            <i class="bi bi-arrow-left-circle me-1"></i> Back to Lessons
          </span>
        </button>
      </div>
    </header>

    <main class="container py-5">
      <div class="toast-container position-fixed top-0 end-0 p-3">
        <div v-if="addedToCartMessage" class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
            <i class="bi bi-check-circle-fill text-success me-2"></i>
            <strong class="me-auto">Success</strong>
            <button type="button" class="btn-close" @click="addedToCartMessage = ''" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            {{ addedToCartMessage }}
          </div>
          <div class="progress" style="height: 4px;">
            <div 
              class="progress-bar bg-success" 
              role="progressbar" 
              :style="{ width: messageProgress + '%' }"
            ></div>
          </div>
        </div>
      </div>
      
      <Lessons v-if="showLessons" :lessons="lessons" @addToCart="addToCart" />
      <Cart v-else :cart="cart" @removeFromCart="removeFromCart" @checkout="checkout" @backToLessons="showLessons = true" />
    </main>
  </div>
</template>

<style>
/* Global styles for a modern look */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

:root {
  --primary-color: #4A90E2;
  --secondary-color: #50E3C2;
  --text-color: #4A4A4A;
  --bg-color: #F4F7F6;
  --card-bg: #FFFFFF;
  --border-radius: 8px;
  --shadow: 0 4px 12px rgba(0,0,0,0.08);
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
}

#app-container {
  min-height: 100vh;
}

.app-header {
  background-color: var(--card-bg);
  padding: 1.25rem 0;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: var(--shadow);
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.btn-primary:hover {
  background-color: #357ABD;
  border-color: #357ABD;
  transform: translateY(-2px);
}
.btn-outline-primary {
    color: var(--primary-color);
    border-color: var(--primary-color);
}
.btn-outline-primary:hover {
    background-color: var(--primary-color);
    color: white;
}
</style>