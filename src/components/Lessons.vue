<script setup>
const props = defineProps({
  lessons: Array,
});
</script>
<template>
  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
    <div class="col" v-for="lesson in lessons" :key="lesson._id">
      <div class="card h-100 shadow-sm text-center">
        <img :src="lesson.image" :alt="lesson.topic" class="card-img-top mx-auto mt-3" style="width: 100px; height: 100px; object-fit: contain;" />
        <div class="card-body">
          <h2 class="card-title h5">{{ lesson.topic }}</h2>
          <p class="card-text"><strong>Location:</strong> {{ lesson.location }}</p>
          <p class="card-text"><strong>Price:</strong> ${{ lesson.price }}</p>
          <p class="card-text"><strong>Spaces:</strong> {{ lesson.space }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card:hover {
  transform: translateY(-5px); 
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); 
  transition: transform 0.3s ease, box-shadow 0.3s ease; 
}
</style>