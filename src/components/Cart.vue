<script setup>
const props = defineProps({
  cart: Array,
});
const emit = defineEmits(['removeFromCart']);
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
  </div>
</template>