<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  cart: Array,
}); //
const emit = defineEmits(['removeFromCart', 'checkout', 'backToLessons']); //

// Refs for the form fields
const firstName = ref('');
const lastName = ref('');
const address = ref('');
const city = ref('');
const postcode = ref('');
const phoneNumber = ref('');
const checkoutMessage = ref('');

// Real-time validation for first name (no numbers)
const isFirstNameInvalid = computed(() => {
  return firstName.value.length > 0 && /\d/.test(firstName.value);
});

// Real-time validation for last name (no numbers)
const isLastNameInvalid = computed(() => {
  return lastName.value.length > 0 && /\d/.test(lastName.value);
});

// Real-time validation for phone number (no letters/symbols)
const isPhoneNumberInvalid = computed(() => {
  return phoneNumber.value.length > 0 && /\D/.test(phoneNumber.value);
});

// Main form validation logic
const isFormValid = computed(() => {
  return firstName.value.trim() !== '' &&
         lastName.value.trim() !== '' &&
         address.value.trim() !== '' &&
         city.value.trim() !== '' &&
         postcode.value.trim() !== '' &&
         phoneNumber.value.trim() !== '' &&
         !isFirstNameInvalid.value &&
         !isLastNameInvalid.value &&
         !isPhoneNumberInvalid.value;
});

// Checkout function
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
    
    // Clear form fields
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
  <div class="card p-4 shadow-lg border-0" style="border-radius: var(--border-radius);">
    <h2 class="h4 d-flex align-items-center mb-3 fw-bold">
      <i class="bi bi-cart3 me-2 fs-4"></i>
      Shopping Cart
    </h2>
    <hr />

    <div v-if="props.cart.length === 0" class="text-center py-5">
      <div class="empty-cart-icon mb-3">
        <i class="bi bi-cart-x"></i>
      </div>
      <h4 class="fw-bold">Your Cart is Empty</h4>
      <p class="text-muted">Looks like you haven't added any lessons yet.</p>
      <button class="btn btn-primary mt-3" @click="$emit('backToLessons')">
        <i class="bi bi-book-half me-1"></i> Browse Lessons
      </button>
    </div>
    
    <div v-else>
      <div v-for="item in props.cart" :key="item._id" class="d-flex align-items-center mb-3">
        <img :src="item.image" :alt="item.topic" class="me-3" style="width: 70px; height: 70px; object-fit: cover; border-radius: var(--border-radius);" />
        <div class="flex-grow-1">
          <h5 class="mb-1 fw-bold">{{ item.topic }}</h5>
          <p class="mb-1 text-muted">Quantity: {{ item.quantity }}</p>
          <p class="mb-0 fw-bold">${{ item.price * item.quantity }}</p>
        </div>
        <button class="btn btn-outline-danger btn-sm" @click="$emit('removeFromCart', item)">
            <i class="bi bi-trash"></i>
        </button>
      </div>
      
      <div class="mt-5">
        <h3 class="h5 fw-bold">Checkout</h3>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="firstName" class="form-label">First Name</label>
            <input type="text" id="firstName" class="form-control" v-model="firstName" :class="{ 'is-invalid': isFirstNameInvalid }" />
          </div>
          <div class="col-md-6 mb-3">
            <label for="lastName" class="form-label">Last Name</label>
            <input type="text" id="lastName" class="form-control" v-model="lastName" :class="{ 'is-invalid': isLastNameInvalid }" />
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
            <input type="text" id="phone" class="form-control" v-model="phoneNumber" :class="{ 'is-invalid': isPhoneNumberInvalid }" />
        </div>
        <button class="btn btn-primary w-100 btn-lg mt-2" @click="checkout" :disabled="!isFormValid || props.cart.length === 0">
          Complete Purchase
        </button>
        <div v-if="checkoutMessage" class="mt-3 alert alert-success">
          {{ checkoutMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.empty-cart-icon {
  font-size: 5rem;
  color: #e0e0e0;
}
</style>