<script setup>
defineProps({
  variant: { type: String, default: "primary" },
  type: { type: String, default: "button" },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});
defineEmits(["click"]);
</script>
<template>
  <button
    :type="type"
    :class="['app-button', `btn-${variant}`, { 'btn-loading': loading }]"
    :disabled="disabled || loading"
    :aria-busy="loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="btn-spinner" aria-hidden="true"></span>
    <slot />
  </button>
</template>
<style scoped>
.app-button {
  font-size: 13px;
  font-weight: 600;
  padding: 12px 21px;
  border-radius: 10px;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  min-height: 44px;
  line-height: 1.5;
}
.app-button:hover:not(:disabled) {
  transform: translateY(-2px);
}
.app-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
  transform: none;
}
.btn-loading {
  cursor: wait;
}
.btn-primary {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 4px 12px rgb(98 80 201 / 12%);
}
.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
}
.btn-secondary {
  background: var(--bg-gray);
  color: var(--text-main);
  border-color: var(--border-color);
}
.btn-secondary:hover {
  background: #eae7f2;
}
.btn-outline {
  background: transparent;
  color: var(--primary);
  border-color: #cfc7e8;
}
.btn-outline:hover {
  background: var(--primary-soft);
}
</style>
