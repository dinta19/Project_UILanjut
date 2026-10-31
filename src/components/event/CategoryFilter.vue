<script setup>
defineProps({
  categories: { type: Array, required: true },
  modelValue: { type: String, default: "All" },
});
defineEmits(["update:modelValue"]);
</script>
<template>
  <div class="category-filter" role="group" aria-label="Filter event category">
    <button
      v-for="cat in categories"
      :key="cat"
      :class="['filter-btn', { active: modelValue === cat }]"
      :aria-pressed="modelValue === cat"
      @click="$emit('update:modelValue', cat)"
    >
      {{ cat === "All" ? "All events" : cat }}
    </button>
  </div>
</template>
<style scoped>
.category-filter {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.filter-btn {
  background: white;
  border: 1px solid var(--border-color);
  padding: 9px 17px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
}
.filter-btn:hover {
  border-color: #c9c0e5;
  color: var(--primary);
  background: var(--primary-soft);
}
.filter-btn.active {
  background: var(--text-main);
  border-color: var(--text-main);
  color: white;
}
@media (max-width: 480px) {
  .filter-btn {
    padding: 8px 12px;
    font-size: 11px;
  }
}
</style>
