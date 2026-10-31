<script setup>
import AppIcon from "@/components/ui/AppIcon.vue";
defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "Search by event name or location…" },
  label: { type: String, default: "Search events by title or location" },
});
defineEmits(["update:modelValue"]);
</script>
<template>
  <div class="search-bar">
    <AppIcon name="search" :size="19" /><input
      type="search"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :aria-label="label"
    /><button
      v-if="modelValue"
      aria-label="Clear search"
      @click="$emit('update:modelValue', '')"
    >
      <AppIcon name="close" :size="16" />
    </button>
  </div>
</template>
<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  min-height: 49px;
  padding: 0 15px;
  border: 1px solid var(--border-color);
  background: #fff;
  border-radius: 11px;
  color: #8a859c;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.search-bar:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-soft);
}
input {
  width: 100%;
  min-width: 0;
  padding: 13px 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text-main);
  font-size: 13px;
}
input::placeholder {
  color: #96919f;
}
input::-webkit-search-cancel-button {
  display: none;
}
button {
  padding: 4px;
  border: 0;
  background: none;
  color: var(--text-muted);
  display: grid;
  place-items: center;
}
</style>
