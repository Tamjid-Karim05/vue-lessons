<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  cart: Array,
});
const emit = defineEmits(['removeFromCart', 'checkout']);

const name = ref('');
const phoneNumber = ref('');
const checkoutMessage = ref('');

const isFormValid = computed(() => {
  const nameRegex = /^[A-Za-z\s]+$/;
  const phoneRegex = /^[0-9]+$/;
  return nameRegex.test(name.value) && phoneRegex.test(phoneNumber.value);
});

function checkout() {
  if (isFormValid.value) {
    const orderDetails = {
      name: name.value,
      phoneNumber: phoneNumber.value,
      items: props.cart.map(item => ({ id: item._id, quantity: item.quantity })),
    };
    emit('checkout', orderDetails);
    
    name.value = '';
    phoneNumber.value = '';
    checkoutMessage.value = 'Order submitted successfully!';
    
    setTimeout(() => {
      checkoutMessage.value = '';
    }, 5000);
  }
}
</script>

<template>
  <div class="card p-4 shadow-sm">
    <h2 class="h4 d-flex align-items-center mb-3">
      <img src="/images/cart-icon.png" alt="Shopping Cart" style="width: 30px; height: 30px; margin-right: 10px;" />
      Shopping Cart
    </h2>
    <hr />
    <div v-if="props.cart.length === 0" class="text-center text-muted py-5">
      Your cart is empty.
    </div>
    <div v-else>
      <div v-for="item in props.cart" :key="item._id" class="d-flex align-items-center mb-3">
        <img :src="item.image" :alt="item.topic" class="me-3" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;" />
        <div class="flex-grow-1">
          <h5 class="mb-1">{{ item.topic }}</h5>
          <p class="mb-1">Quantity: {{ item.quantity }}</p>
          <p class="mb-0">Price: ${{ item.price * item.quantity }}</p>
        </div>
        <button class="btn btn-danger" @click="$emit('removeFromCart', item)">Remove</button>
      </div>
    </div>
    
    <div class="mt-4">
      <h3 class="h5">Checkout</h3>
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" id="name" class="form-control" v-model="name" />
      </div>
      <div class="mb-3">
        <label for="phone" class="form-label">Phone Number</label>
        <input type="text" id="phone" class="form-control" v-model="phoneNumber" />
      </div>
      <button class="btn btn-success w-100" @click="checkout" :disabled="!isFormValid">
        Checkout
      </button>
      <div v-if="checkoutMessage" class="mt-3 alert alert-success">
        {{ checkoutMessage }}
      </div>
    </div>
  </div>
</template>