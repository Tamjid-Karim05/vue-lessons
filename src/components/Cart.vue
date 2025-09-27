<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  cart: Array,
});
const emit = defineEmits(['removeFromCart', 'checkout']);

// New refs for the updated form fields
const firstName = ref('');
const lastName = ref('');
const address = ref('');
const city = ref('');
const postcode = ref('');
const phoneNumber = ref('');
const checkoutMessage = ref('');

// Updated validation to check all new fields
const isFormValid = computed(() => {
  const phoneRegex = /^[0-9]+$/;
  return firstName.value.trim() !== '' &&
         lastName.value.trim() !== '' &&
         address.value.trim() !== '' &&
         city.value.trim() !== '' &&
         postcode.value.trim() !== '' &&
         phoneRegex.test(phoneNumber.value);
});

// Updated checkout function to emit all new details
function checkout() {
  if (isFormValid.value) {
    const orderDetails = {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      postcode: postcode.value,
      phoneNumber: phoneNumber.value,
      items: props.cart.map(item => ({ id: item._id, quantity: item.quantity })),
    };
    emit('checkout', orderDetails);
    
    // Clear all form fields after successful checkout
    firstName.value = '';
    lastName.value = '';
    address.value = '';
    city.value = '';
    postcode.value = '';
    phoneNumber.value = '';
    checkoutMessage.value = 'Order submitted successfully!';
    
    setTimeout(() => {
      checkoutMessage.value = '';
    }, 5000);
  }
}
</script>

<template>
  <div class="card p-4 shadow">
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
        <button class="btn btn-primary" @click="$emit('removeFromCart', item)">Remove</button>
      </div>
    </div>
    
    <div class="mt-4">
      <h3 class="h5">Checkout</h3>
      
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="firstName" class="form-label">First Name</label>
          <input type="text" id="firstName" class="form-control" v-model="firstName" />
        </div>
        <div class="col-md-6 mb-3">
          <label for="lastName" class="form-label">Last Name</label>
          <input type="text" id="lastName" class="form-control" v-model="lastName" />
        </div>
      </div>

      <div class="mb-3">
        <label for="address" class="form-label">Address</label>
        <input type="text" id="address" class="form-control" v-model="address" />
      </div>

      <div class="row">
        <div class="col-md-8 mb-3">
          <label for="city" class="form-label">City</label>
          <input type="text" id="city" class="form-control" v-model="city" />
        </div>
        <div class="col-md-4 mb-3">
          <label for="postcode" class="form-label">Postcode</label>
          <input type="text" id="postcode" class="form-control" v-model="postcode" />
        </div>
      </div>
      
      <div class="mb-3">
        <label for="phone" class="form-label">Phone Number</label>
        <input type="text" id="phone" class="form-control" v-model="phoneNumber" />
      </div>
      
      <button class="btn btn-primary w-100" @click="checkout" :disabled="!isFormValid || props.cart.length === 0">
        Checkout
      </button>
      <div v-if="checkoutMessage" class="mt-3 alert alert-success">
        {{ checkoutMessage }}
      </div>
    </div>
  </div>
</template>