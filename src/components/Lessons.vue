<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
  lessons: Array,
});
const sortAttribute = ref('topic');
const sortOrder = ref('ascending');
const searchQuery = ref('');
const filteredLessons = computed(() => {
  if (!searchQuery.value) {
    return props.lessons;
  }
  const query = searchQuery.value.toLowerCase();
  return props.lessons.filter(lesson =>
    lesson.topic.toLowerCase().includes(query) ||
    lesson.location.toLowerCase().includes(query) ||
    lesson.price.toString().includes(query) ||
    lesson.space.toString().includes(query)
  );
});
const sortedLessons = computed(() => {
  const sorted = [...filteredLessons.value];
  sorted.sort((a, b) => {
    let comparison = 0;
    if (typeof a[sortAttribute.value] === 'number') {
      comparison = a[sortAttribute.value] - b[sortAttribute.value];
    } else {
      const valueA = a[sortAttribute.value].toLowerCase();
      const valueB = b[sortAttribute.value].toLowerCase();
      if (valueA < valueB) { comparison = -1; }
      else if (valueA > valueB) { comparison = 1; }
    }
    return sortOrder.value === 'descending' ? comparison * -1 : comparison;
  });
  return sorted;
});
</script>
<template>
  <div class="d-flex justify-content-center align-items-center gap-3 mb-4">
    <div class="d-flex align-items-center">
      <label for="search" class="me-2">Search:</label>
      <input type="text" id="search" class="form-control" v-model="searchQuery" placeholder="Search lessons..." />
    </div>
    <div class="d-flex align-items-center">
      <label for="sort-by" class="me-2">Sort By:</label>
      <select id="sort-by" class="form-select" v-model="sortAttribute">
        <option value="topic">Subject</option>
        <option value="location">Location</option>
        <option value="price">Price</option>
        <option value="space">Spaces</option>
      </select>
    </div>
    <div class="d-flex align-items-center">
      <label for="sort-order" class="me-2">Order:</label>
      <select id="sort-order" class="form-select" v-model="sortOrder">
        <option value="ascending">Ascending</option>
        <option value="descending">Descending</option>
      </select>
    </div>
  </div>
  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
    <div class="col" v-for="lesson in sortedLessons" :key="lesson._id">
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