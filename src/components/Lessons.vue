<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  lessons: Array,
}); //
const emit = defineEmits(['addToCart']); //

const sortAttribute = ref('topic'); //
const sortOrder = ref('ascending'); //
const searchQuery = ref(''); //

// Filters lessons based on search query
const filteredLessons = computed(() => {
  if (!searchQuery.value) {
    return props.lessons;
  }
  const query = searchQuery.value.toLowerCase();
  return props.lessons.filter(lesson =>
    lesson.topic.toLowerCase().includes(query) ||
    lesson.location.toLowerCase().includes(query)
  );
});

// Sorts the already filtered lessons
const sortedLessons = computed(() => {
  const sorted = [...filteredLessons.value];
  sorted.sort((a, b) => {
    let comparison = 0;
    let valA = a[sortAttribute.value];
    let valB = b[sortAttribute.value];

    if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
        comparison = valA.localeCompare(valB);
    } else {
        comparison = valA - valB;
    }
    
    return sortOrder.value === 'descending' ? comparison * -1 : comparison;
  });
  return sorted;
});
</script>

<template>
  <div>
    <div class="controls-bar card p-3 mb-5 shadow-sm">
      <div class="row g-3 align-items-center">
        <div class="col-md-4">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control" v-model="searchQuery" placeholder="Search by subject or location..." />
          </div>
        </div>
        <div class="col-md-4">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-sort-down"></i></span>
            <select class="form-select" v-model="sortAttribute">
              <option value="topic">Subject</option>
              <option value="location">Location</option>
              <option value="price">Price</option>
              <option value="space">Spaces</option>
            </select>
          </div>
        </div>
        <div class="col-md-4">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-arrow-down-up"></i></span>
            <select class="form-select" v-model="sortOrder">
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col" v-for="lesson in sortedLessons" :key="lesson._id">
        <div class="card lesson-card h-100">
          <div class="lesson-card-img-container">
            <img :src="lesson.image" :alt="lesson.topic" class="lesson-card-img" />
            <span class="badge bg-dark lesson-price-badge">${{ lesson.price }}</span>
          </div>
          <div class="card-body d-flex flex-column">
            <h2 class="card-title h5 fw-bold">{{ lesson.topic }}</h2>
            <div class="text-muted mb-3 mt-auto">
              <p class="mb-1"><i class="bi bi-geo-alt-fill me-2"></i>{{ lesson.location }}</p>
              <p class="mb-0"><i class="bi bi-person-fill me-2"></i>{{ lesson.space }} spaces available</p>
            </div>
            <button class="btn btn-primary w-100 mt-2" @click="$emit('addToCart', lesson)" :disabled="lesson.space === 0">
              <span v-if="lesson.space > 0">Add to Cart</span>
              <span v-else>Out of Stock</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls-bar {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  border: none;
}
.lesson-card {
  border: none;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden; /* Ensures child elements conform to border-radius */
}
.lesson-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.12);
}
.lesson-card-img-container {
  height: 200px;
  position: relative;
  overflow: hidden;
}
.lesson-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures image covers the area nicely */
  transition: transform 0.4s ease;
}
.lesson-card:hover .lesson-card-img {
  transform: scale(1.05); /* Subtle zoom effect on hover */
}
.lesson-price-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1rem;
  padding: 0.5em 0.75em;
}
.card-body {
  padding: 1.5rem;
}
</style>